import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APPLICATION_STATUSES } from '../../core/models/application.model';
import { ApplicationsService } from '../../core/services/applications.service';
import { StatusBadge } from '../../shared/components/status-badge';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe, StatusBadge],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly service = inject(ApplicationsService);

  protected readonly statuses = APPLICATION_STATUSES;
  protected readonly counts = this.service.counts;

  protected readonly recent = computed(() =>
    [...this.service.all()]
      .sort((a, b) => b.appliedDate.localeCompare(a.appliedDate))
      .slice(0, 5),
  );

  protected readonly breakdown = computed(() => {
    const c = this.counts();
    return this.statuses.map((status) => ({
      status,
      count: c[status],
      percent: c.total ? (c[status] / c.total) * 100 : 0,
    }));
  });
}
