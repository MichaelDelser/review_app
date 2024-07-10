import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const routes: Routes = [
  { path: 'signup', loadComponent: () => import('./sign-up/sign-up.component').then(m => m.SignUpComponent) },
  { path: 'login', loadComponent: () => import('./log-in/log-in.component').then(m => m.LogInComponent) },
  { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

export const appRoutingProviders: any[] = [
  provideRouter(routes),
  provideHttpClient(withInterceptorsFromDi())
];
