import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MaterialModule } from './app/material.module';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    ...MaterialModule,
    ...appConfig.providers
  ]
}).catch(err => console.error(err));
