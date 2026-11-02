import { Component, input } from '@angular/core';
import { ApplicationStatus } from '../../core/models/application.model';

@Component({
  selector: 'app-status-badge',
  template: `<span class="badge" [attr.data-status]="status()">{{ status() }}</span>`,
  styles: `
    .badge {
      display: inline-block;
      padding: 0.15rem 0.65rem;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
    }
    .badge[data-status='Applied'] { color: var(--applied); background: var(--applied-bg); }
    .badge[data-status='Interview'] { color: var(--interview); background: var(--interview-bg); }
    .badge[data-status='Offer'] { color: var(--offer); background: var(--offer-bg); }
    .badge[data-status='Rejected'] { color: var(--rejected); background: var(--rejected-bg); }
  `,
})
export class StatusBadge {
  readonly status = input.required<ApplicationStatus>();
}
