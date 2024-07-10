import { importProvidersFrom } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export const MaterialModule = [
  importProvidersFrom(MatToolbarModule),
  importProvidersFrom(MatButtonModule),
  importProvidersFrom(MatCardModule),
  importProvidersFrom(MatFormFieldModule),
  importProvidersFrom(MatInputModule)
];
