import { Injectable, computed, effect, inject, signal } from '@angular/core';
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  JobApplication,
  JobApplicationInput,
  SortDirection,
  SortKey,
  StatusFilter,
  isJobApplication,
} from '../models/application.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'careertrack.applications';

@Injectable({ providedIn: 'root' })
export class ApplicationsService {
  private readonly storage = inject(StorageService);

  private readonly items = signal<JobApplication[]>(
    this.storage.get<JobApplication[]>(STORAGE_KEY, []),
  );

  readonly all = this.items.asReadonly();
  readonly searchTerm = signal('');
  readonly statusFilter = signal<StatusFilter>('All');
  readonly sortKey = signal<SortKey>('appliedDate');
  readonly sortDirection = signal<SortDirection>('desc');

  readonly filtered = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();
    const key = this.sortKey();
    const direction = this.sortDirection() === 'asc' ? 1 : -1;

    return this.items()
      .filter((a) => status === 'All' || a.status === status)
      .filter(
        (a) =>
          !term ||
          [a.company, a.position, a.location].some((f) => f.toLowerCase().includes(term)),
      )
      .sort((a, b) => this.compare(a, b, key) * direction);
  });

  readonly counts = computed(() => {
    const byStatus = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 } satisfies Record<
      ApplicationStatus,
      number
    >;
    const list = this.items();
    for (const a of list) byStatus[a.status]++;
    return { total: list.length, ...byStatus };
  });

  constructor() {
    effect(() => this.storage.set(STORAGE_KEY, this.items()));
  }

  getById(id: string): JobApplication | undefined {
    return this.items().find((a) => a.id === id);
  }

  add(input: JobApplicationInput): void {
    const item: JobApplication = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.items.update((list) => [item, ...list]);
  }

  update(id: string, input: JobApplicationInput): void {
    this.items.update((list) => list.map((a) => (a.id === id ? { ...a, ...input } : a)));
  }

  remove(id: string): void {
    this.items.update((list) => list.filter((a) => a.id !== id));
  }

  updateStatus(id: string, status: ApplicationStatus): void {
    this.items.update((list) => list.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  toggleSort(key: SortKey): void {
    if (this.sortKey() === key) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortKey.set(key);
      this.sortDirection.set(key === 'appliedDate' ? 'desc' : 'asc');
    }
  }

  private compare(a: JobApplication, b: JobApplication, key: SortKey): number {
    if (key === 'status') {
      return APPLICATION_STATUSES.indexOf(a.status) - APPLICATION_STATUSES.indexOf(b.status);
    }
    return a[key].localeCompare(b[key]);
  }

  exportJson(): string {
    return JSON.stringify(this.items(), null, 2);
  }

  /** Imports applications from a JSON string. Returns how many new items were added. */
  importJson(text: string): number {
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('The selected file is not valid JSON.');
    }

    if (!Array.isArray(data)) {
      throw new Error('Unexpected file format: expected a list of applications.');
    }

    const valid = data.filter(isJobApplication);
    if (valid.length === 0) {
      throw new Error('No valid applications were found in this file.');
    }

    const existingIds = new Set(this.items().map((a) => a.id));
    const fresh = valid.filter((a) => !existingIds.has(a.id));
    this.items.update((list) => [...fresh, ...list]);
    return fresh.length;
  }
}
