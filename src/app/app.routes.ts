import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    title: 'Dashboard · CareerTrack',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'applications',
    title: 'Applications · CareerTrack',
    loadComponent: () =>
      import('./features/applications/application-list').then((m) => m.ApplicationList),
  },
  {
    path: 'applications/new',
    title: 'New application · CareerTrack',
    loadComponent: () =>
      import('./features/applications/application-form').then((m) => m.ApplicationForm),
  },
  {
    path: 'applications/:id/edit',
    title: 'Edit application · CareerTrack',
    loadComponent: () =>
      import('./features/applications/application-form').then((m) => m.ApplicationForm),
  },
  { path: '**', redirectTo: 'dashboard' },
];
