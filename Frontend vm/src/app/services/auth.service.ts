import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface User {
  id?: string;
  fullName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://192.168.165.138:5000/api/auth';

  private tokenKey = 'speedbuycars_token';
  private userKey = 'speedbuycars_user';

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  register(user: { fullName: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  sendPasscode(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-passcode`, { email, password });
  }

  verifyPasscode(email: string, passcode: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-passcode`, { email, passcode });
  }

  saveLogin(data: any): void {
    if (!this.isBrowser()) return;

    localStorage.setItem(this.tokenKey, data.token);
    localStorage.setItem(this.userKey, JSON.stringify(data.user));
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    if (!this.isBrowser()) return null;

    const savedUser = localStorage.getItem(this.userKey);
    return savedUser ? JSON.parse(savedUser) : null;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }

    this.router.navigate(['/login']);
  }
}