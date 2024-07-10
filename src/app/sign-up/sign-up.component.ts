import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class SignUpComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  signUp(): void {
    this.authService.signUp(this.username, this.password).subscribe({
      next: () => {
        this.authService.logIn(this.username, this.password).subscribe({
          next: (response) => {
            this.authService.setToken(response.token);
            this.router.navigate(['/home']);  // Navigate to the home screen
          },
          error: (error) => {
            this.errorMessage = error;
          }
        });
      },
      error: (error) => {
        this.errorMessage = error;
      }
    });
  }
}
