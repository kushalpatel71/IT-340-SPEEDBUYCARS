import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  successMessage = '';
  isLoading = false;

  private API_BASE = 'http://192.168.165.138:5000';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  register(): void {
    if (this.isLoading) return;

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.fullName.trim() || !this.email.trim() || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const payload = {
      fullName: this.fullName.trim(),
      email: this.email.trim().toLowerCase(),
      password: this.password
    };

    this.isLoading = true;

    this.http.post<any>(`${this.API_BASE}/api/auth/register`, payload)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.successMessage = response?.message || 'Registration successful. Redirecting to login...';

          setTimeout(() => {
            this.router.navigate(['/login'], { queryParams: { registered: 'true' } });
          }, 1200);
        },
        error: (error) => {
          console.error('Register error:', error);

          if (error.name === 'TimeoutError') {
            this.errorMessage = 'Request timed out. Check if backend server is running.';
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to backend. Check backend IP, port, and CORS.';
          } else {
            this.errorMessage = error.error?.message || 'Registration failed.';
          }
        }
      });
  }
}