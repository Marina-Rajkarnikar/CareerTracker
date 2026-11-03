import { DatePipe } from '@angular/common';
import { Component, inject, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  JobApplication,
  SortDirection,
  SortKey,
  StatusFilter,
} from '../../core/models/application.model';
import { ApplicationsService } from '../../core/services/applications.service';

@Component({
  selector: 'app-application-list',
  imports: [RouterLink, DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './application-list.html',
  styleUrl: './application-list.scss',
})
export class ApplicationList {
  protected readonly service = inject(ApplicationsService);
  protected readonly statuses = APPLICATION_STATUSES;

  protected readonly sortOptions = [
    { value: 'appliedDate:desc', label: 'Newest first' },
    { value: 'appliedDate:asc', label: 'Oldest first' },
    { value: 'company:asc', label: 'Company A–Z' },
    { value: 'company:desc', label: 'Company Z–A' },
    { value: 'position:asc', label: 'Position A–Z' },
    { value: 'status:asc', label: 'Status' },
  ];

  protected readonly message = signal<{ type: 'success' | 'error'; text: string } | null>(null);

  protected setStatus(value: string): void {
    this.service.statusFilter.set(value as StatusFilter);
  }

  protected clearFilters(): void {
    this.service.searchTerm.set('');
    this.service.statusFilter.set('All');
  }

  protected remove(app: JobApplication): void {
    if (window.confirm(`Delete your application to ${app.company}?`)) {
      this.service.remove(app.id);
    }
  }

  protected changeStatus(app: JobApplication, value: string): void {
    this.service.updateStatus(app.id, value as ApplicationStatus);
  }

  protected sortBy(key: SortKey): void {
    this.service.toggleSort(key);
  }

  protected setSort(value: string): void {
    const [key, direction] = value.split(':') as [SortKey, SortDirection];
    this.service.sortKey.set(key);
    this.service.sortDirection.set(direction);
  }

  protected sortValue(): string {
    return `${this.service.sortKey()}:${this.service.sortDirection()}`;
  }

  protected ariaSort(key: SortKey): 'ascending' | 'descending' | 'none' {
    if (this.service.sortKey() !== key) return 'none';
    return this.service.sortDirection() === 'asc' ? 'ascending' : 'descending';
  }

  protected sortIcon(key: SortKey): string {
    if (this.service.sortKey() !== key) return '';
    return this.service.sortDirection() === 'asc' ? '↑' : '↓';
  }

  protected exportData(): void {
    const blob = new Blob([this.service.exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `careertrack-${new Date().toLocaleDateString('en-CA')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  protected async importData(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    try {
      const count = this.service.importJson(await file.text());
      this.message.set({
        type: 'success',
        text: count > 0 ? `Imported ${count} application(s).` : 'Nothing new to import.',
      });
    } catch (error) {
      this.message.set({
        type: 'error',
        text: error instanceof Error ? error.message : 'Import failed.',
      });
    } finally {
      input.value = '';
    }
  }
}
