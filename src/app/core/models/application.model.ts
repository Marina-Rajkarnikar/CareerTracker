export type ApplicationStatus = 'Applied' | 'Interview' | 'Offer' | 'Rejected';
export type StatusFilter = ApplicationStatus | 'All';

export type SortKey = 'company' | 'position' | 'appliedDate' | 'status';
export type SortDirection = 'asc' | 'desc';

export const APPLICATION_STATUSES: readonly ApplicationStatus[] = [
  'Applied',
  'Interview',
  'Offer',
  'Rejected',
];

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  status: ApplicationStatus;
  appliedDate: string; // yyyy-MM-dd
  notes: string;
  createdAt: string; // ISO timestamp
}

export type JobApplicationInput = Omit<JobApplication, 'id' | 'createdAt'>;

export function isJobApplication(value: unknown): value is JobApplication {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v['id'] === 'string' &&
    typeof v['company'] === 'string' &&
    typeof v['position'] === 'string' &&
    typeof v['location'] === 'string' &&
    typeof v['appliedDate'] === 'string' &&
    typeof v['notes'] === 'string' &&
    typeof v['createdAt'] === 'string' &&
    APPLICATION_STATUSES.includes(v['status'] as ApplicationStatus)
  );
}
