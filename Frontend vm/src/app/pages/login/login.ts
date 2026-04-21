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
  isLoading = false;

  private API_BASE = 'http://192.168.79.143:5000';

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

  sendPasscode(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password first.';
      return;
    }

    const payload = {
      email: this.email.trim().toLowerCase(),
      password: this.password
    };

    this.isLoading = true;

    this.http.post<any>(`${this.API_BASE}/api/auth/send-passcode`, payload).subscribe({
      next: (response) => {
        console.log('send-passcode response:', response);
        this.isLoading = false;
        this.successMessage = response.message || 'Passcode sent to your email.';
        this.showPasscodeBox = true;
      },
      error: (error) => {
        console.error('send-passcode error:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to send passcode.';
        this.showPasscodeBox = false;
      }
    });
  }

  verifyPasscode(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.passcode) {
      this.errorMessage = 'Please enter the passcode from your email.';
      return;
    }

    const payload = {
      email: this.email.trim().toLowerCase(),
      passcode: this.passcode.trim()
    };

    this.isLoading = true;

    this.http.post<any>(`${this.API_BASE}/api/auth/verify-passcode`, payload).subscribe({
      next: (response) => {
        console.log('verify-passcode response:', response);
        this.isLoading = false;
        this.successMessage = response.message || 'Login successful.';
        localStorage.setItem('speedBuyCarsCurrentUser', JSON.stringify(response.user));

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (error) => {
        console.error('verify-passcode error:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Invalid passcode.';
      }
    });
  }
}