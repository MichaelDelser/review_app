import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Replace with your actual API URL
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  logIn(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password })
      .pipe(
        catchError(this.handleError)
      );
  }

  signUp(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { username, password })
      .pipe(
        catchError(this.handleError)
      );
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.error.errors) {
      // Validation error
      errorMessage = error.error.errors.map((err: any) => err.msg).join(', ');
    } else if (error.error.msg) {
      // Specific message from server
      errorMessage = error.error.msg;
    } else if (error.message) {
      // General error message
      errorMessage = `Error: ${error.message}`;
    }

    return throwError(errorMessage);
  }
}
