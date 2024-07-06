// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module'; // Import the MaterialModule

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MaterialModule], // Add MaterialModule to imports
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'auth-app';
}
