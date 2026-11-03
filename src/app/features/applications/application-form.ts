import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { APPLICATION_STATUSES, ApplicationStatus } from '../../core/models/application.model';
import { ApplicationsService } from '../../core/services/applications.service';

@Component({
  selector: 'app-application-form',
  imports: [ReactiveFormsModule, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './application-form.html',
  styleUrl: './application-form.scss',
})
export class ApplicationForm {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ApplicationsService);

  private readonly id = this.route.snapshot.paramMap.get('id');

  protected readonly isEdit = this.id !== null;
  protected readonly statuses = APPLICATION_STATUSES;

  protected readonly form = this.fb.group({
    company: ['', [Validators.required, Validators.maxLength(80)]],
    position: ['', [Validators.required, Validators.maxLength(80)]],
    location: ['', Validators.maxLength(80)],
    status: ['Applied' as ApplicationStatus, Validators.required],
    appliedDate: [new Date().toLocaleDateString('en-CA'), Validators.required],
    notes: ['', Validators.maxLength(500)],
  });

  constructor() {
    if (this.id) {
      const existing = this.service.getById(this.id);
      if (existing) {
        this.form.patchValue(existing);
      } else {
        void this.router.navigate(['/applications']);
      }
    }
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const value = {
      ...raw,
      company: raw.company.trim(),
      position: raw.position.trim(),
      location: raw.location.trim(),
      notes: raw.notes.trim(),
    };

    if (this.id) {
      this.service.update(this.id, value);
    } else {
      this.service.add(value);
    }
    void this.router.navigate(['/applications']);
  }
}
