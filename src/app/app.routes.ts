import { Routes } from '@angular/router';
import { adminGuard, operatorGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-shell/admin-shell.component').then(m => m.AdminShellComponent),
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'sites',
        loadComponent: () => import('./features/admin/sites/sites-list/sites-list.component').then(m => m.SitesListComponent)
      },
      {
        path: 'sites/new',
        loadComponent: () => import('./features/admin/sites/site-form/site-form.component').then(m => m.SiteFormComponent)
      },
      {
        path: 'sites/:id/edit',
        loadComponent: () => import('./features/admin/sites/site-form/site-form.component').then(m => m.SiteFormComponent)
      },
      {
        path: 'sites/:id',
        loadComponent: () => import('./features/admin/sites/site-detail/site-detail.component').then(m => m.SiteDetailComponent)
      },
      {
        path: 'operators',
        loadComponent: () => import('./features/admin/operators/operators-list/operators-list.component').then(m => m.OperatorsListComponent)
      },
      {
        path: 'operators/new',
        loadComponent: () => import('./features/admin/operators/operator-form/operator-form.component').then(m => m.OperatorFormComponent)
      },
      {
        path: 'operators/:id/edit',
        loadComponent: () => import('./features/admin/operators/operator-form/operator-form.component').then(m => m.OperatorFormComponent)
      },
      {
        path: 'operators/:id',
        loadComponent: () => import('./features/admin/operators/operator-detail/operator-detail.component').then(m => m.OperatorDetailComponent)
      },
      {
        path: 'attendance',
        loadComponent: () => import('./features/admin/attendance/attendance.component').then(m => m.AttendanceComponent)
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/admin/documents/documents.component').then(m => m.DocumentsComponent)
      },
      {
        path: 'statistics/:operatorId',
        loadComponent: () => import('./features/admin/statistics/statistics.component').then(m => m.StatisticsComponent)
      },
    ]
  },
  {
    path: 'operator',
    loadComponent: () => import('./features/operator/operator-shell/operator-shell.component').then(m => m.OperatorShellComponent),
    canActivate: [operatorGuard],
    children: [
      { path: '', redirectTo: 'attendance', pathMatch: 'full' },
      {
        path: 'attendance',
        loadComponent: () => import('./features/operator/my-attendance/my-attendance.component').then(m => m.MyAttendanceComponent)
      },
      {
        path: 'documents',
        loadComponent: () => import('./features/operator/my-documents/my-documents.component').then(m => m.MyDocumentsComponent)
      },
    ]
  },
  { path: '**', redirectTo: '/login' }
];
