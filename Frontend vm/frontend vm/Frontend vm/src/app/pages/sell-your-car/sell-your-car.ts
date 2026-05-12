import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
  ) {}

  submitVehicle(): void {
    if (this.isLoading) return;

    this.errorMessage = '';
    this.successMessage = '';

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

    this.http.post<any>(`${this.API_BASE}/api/sellcar`, payload)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          console.log('sellcar response:', response);

          this.successMessage =
            response?.message || 'Vehicle submitted successfully. Redirecting...';

          setTimeout(() => {
            this.router.navigate(['/sell-success'], {
              state: payload
            });
          }, 800);
        },
        error: (error) => {
          console.error('sellcar error:', error);

          if (error.name === 'TimeoutError') {
            this.errorMessage = 'Request timed out. Check if backend server is running.';
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to backend. Check backend IP, port, and CORS.';
          } else {
            this.errorMessage = error.error?.message || 'Failed to submit vehicle.';
          }
        }
      });
  }
}