import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LogInComponent } from './log-in/log-in.component';
import {ProtectedComponent} from "./protected/protected.component";
import { AuthGuard } from './auth.guard'; // Import AuthGuard

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'login', component: LogInComponent },
  { path: 'protected', component: ProtectedComponent, canActivate: [AuthGuard] }  // Protected route example
];
