import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { AuthInterceptor } from './app/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
}).catch(err => console.error(err));
