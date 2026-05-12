import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-sell-your-car',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sell-your-car.html',
  styleUrls: ['./sell-your-car.css']
})
export class SellYourCarComponent {
  formData = {
    fullname: '',
    email: '',
    phone: '',
    make: '',
    model: '',
    year: '',
    trim: '',
    mileage: '',
    condition: '',
    askingPrice: '',
    notes: ''
  };

  errorMessage = '';
  successMessage = '';
  isLoading = false;

  private API_BASE = 'http://192.168.165.138:5000';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    const userRaw = localStorage.getItem('speedbuycars_user');

    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        this.formData.fullname = user.fullName || '';
        this.formData.email = user.email || '';
      } catch {
        console.log('No saved user found.');
      }
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('speedbuycars_token');

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  submitVehicle(): void {
    if (this.isLoading) return;

    this.errorMessage = '';
    this.successMessage = '';

    const token = localStorage.getItem('speedbuycars_token');

    if (!token) {
      this.errorMessage = 'Please login first.';
      this.router.navigate(['/login']);
      return;
    }

    if (
      !this.formData.fullname.trim() ||
      !this.formData.email.trim() ||
      !this.formData.phone.trim() ||
      !this.formData.make.trim() ||
      !this.formData.model.trim() ||
      !this.formData.year.trim() ||
      !this.formData.mileage.trim() ||
      !this.formData.condition.trim() ||
      !this.formData.askingPrice.trim()
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const payload = {
      fullName: this.formData.fullname.trim(),
      email: this.formData.email.trim().toLowerCase(),
      phone: this.formData.phone.trim(),
      vehicleYear: this.formData.year.trim(),
      vehicleMake: this.formData.make.trim(),
      vehicleModel: this.formData.model.trim(),
      vehicleTrim: this.formData.trim.trim(),
      mileage: this.formData.mileage.trim(),
      condition: this.formData.condition.trim(),
      askingPrice: this.formData.askingPrice.trim(),
      notes: this.formData.notes.trim()
    };

    this.isLoading = true;

    this.http.post<any>(`${this.API_BASE}/api/sellcar`, payload, {
      headers: this.getAuthHeaders()
    })
      .pipe(
        timeout(15000),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          console.log('sellcar response:', response);

          this.successMessage =
            response?.message || 'Vehicle submitted successfully. Redirecting...';

          localStorage.setItem('sellSuccessData', JSON.stringify(payload));

          setTimeout(() => {
            this.router.navigate(['/sell-success'], {
              state: payload
            });
          }, 500);
        },
        error: (error) => {
          console.error('sellcar error:', error);

          if (error.name === 'TimeoutError') {
            this.errorMessage = 'Request timed out. Backend or email sending is not responding.';
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to backend. Check backend IP, port 5000, and CORS.';
          } else if (error.status === 401 || error.status === 403) {
            this.errorMessage = 'Login expired. Please login again.';
            localStorage.removeItem('speedbuycars_token');
            localStorage.removeItem('speedbuycars_user');
            setTimeout(() => this.router.navigate(['/login']), 700);
          } else {
            this.errorMessage =
              error.error?.message || 'Failed to submit vehicle.';
          }
        }
      });
  }
}