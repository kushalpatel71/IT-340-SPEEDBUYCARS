import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  passcode = '';

  showPassword = false;
  showPasscodeBox = false;

  noticeMessage = '';
  errorMessage = '';
  successMessage = '';

  isSending = false;
  isVerifying = false;

  private API_BASE = 'http://192.168.165.138:5000';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['registered'] === 'true') {
        this.noticeMessage = 'Registration successful. Please login and request your passcode.';
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  private cleanEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private containsInjection(value: string): boolean {
    const badPatterns = [
      /('|--|;|\/\*|\*\/|\$|\{|\})/i,
      /\b(select|insert|update|delete|drop|union|alter|create|truncate|exec|script)\b/i
    ];

    return badPatterns.some(pattern => pattern.test(value));
  }

  sendPasscode(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.noticeMessage = '';

    const cleanEmail = this.cleanEmail(this.email);

    if (!cleanEmail || !this.password) {
      this.errorMessage = 'Please enter your email and password first.';
      return;
    }

    if (!this.isValidEmail(cleanEmail)) {
      this.errorMessage = 'Please enter a valid email address.';
      return;
    }

    if (this.containsInjection(cleanEmail) || this.containsInjection(this.password)) {
      this.errorMessage = 'Invalid characters detected.';
      return;
    }

    this.isSending = true;

    this.http.post<any>(`${this.API_BASE}/api/auth/send-passcode`, {
      email: cleanEmail,
      password: this.password
    }).subscribe({
      next: (response) => {
        this.isSending = false;
        this.showPasscodeBox = true;
        this.successMessage = response.message || 'Passcode sent to your email.';
      },
      error: (error) => {
        this.isSending = false;
        this.showPasscodeBox = false;
        this.errorMessage = error.error?.message || 'Failed to send passcode.';
      }
    });
  }

  verifyPasscode(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.noticeMessage = '';

    const cleanEmail = this.cleanEmail(this.email);
    const cleanPasscode = this.passcode.trim();

    if (!this.showPasscodeBox) {
      this.errorMessage = 'Please click Send Passcode first.';
      return;
    }

    if (!cleanPasscode) {
      this.errorMessage = 'Please enter the passcode from your email.';
      return;
    }

    if (!/^\d{6}$/.test(cleanPasscode)) {
      this.errorMessage = 'Passcode must be 6 numbers.';
      return;
    }

    this.isVerifying = true;

    this.http.post<any>(`${this.API_BASE}/api/auth/verify-passcode`, {
      email: cleanEmail,
      passcode: cleanPasscode
    }).subscribe({
      next: (response) => {
        this.isVerifying = false;
        this.successMessage = response.message || 'Login successful.';
        
        if (response.token && response.user) {
          localStorage.setItem('speedbuycars_token', response.token);
          localStorage.setItem('speedbuycars_user', JSON.stringify(response.user));
        }

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 800);
      },
      error: (error) => {
        this.isVerifying = false;
        this.errorMessage = error.error?.message || 'Invalid passcode.';
      }
    });
  }
}