// src/app/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Replace with your actual API URL

  constructor(private http: HttpClient, private router: Router) {}

  signUp(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { username, password });
  }

  logIn(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }
}
