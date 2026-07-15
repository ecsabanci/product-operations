import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login) // Lazy loading
  },
  {
    path: '',
    loadComponent: () => import('./shared/layout/layout').then((m) => m.Layout), // parent component
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/products').then((m) => m.Products)
      },
      {
        path: 'compare',
        loadComponent: () =>
          import('./features/comparison/comparison').then((m) => m.Comparison)
      },
      {
        path: 'low-stock',
        loadComponent: () =>
          import('./features/low-stock/low-stock').then((m) => m.LowStock)
      }
    ]
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./pages/unauthorized/unauthorized').then((m) => m.Unauthorized)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then((m) => m.NotFound)
  }
];