import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
  private API_BASE = 'http://192.168.79.143:5000';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  submitVehicle(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.formData.fullname ||
      !this.formData.email ||
      !this.formData.phone ||
      !this.formData.make ||
      !this.formData.model ||
      !this.formData.year ||
      !this.formData.mileage ||
      !this.formData.condition ||
      !this.formData.askingPrice
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const payload = {
      fullName: this.formData.fullname.trim(),
      email: this.formData.email.trim().toLowerCase(),
      phone: this.formData.phone.trim(),
      vehicleYear: String(this.formData.year).trim(),
      vehicleMake: this.formData.make.trim(),
      vehicleModel: this.formData.model.trim(),
      mileage: this.formData.mileage.trim(),
      condition: this.formData.condition.trim(),
      askingPrice: this.formData.askingPrice.trim(),
      notes: this.formData.notes.trim()
    };

    this.isLoading = true;

    this.http.post<any>(`${this.API_BASE}/api/sellcar`, payload).subscribe({
      next: (response) => {
        console.log('sellcar response:', response);
        this.isLoading = false;
        this.successMessage = response.message || 'Vehicle submitted successfully.';

        this.router.navigate(['/sell-success'], {
          state: payload
        });
      },
      error: (error) => {
        console.error('sellcar error:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to submit vehicle.';
      }
    });
  }
}