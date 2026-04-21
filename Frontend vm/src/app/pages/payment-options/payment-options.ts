import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment-options',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-options.html',
  styleUrl: './payment-options.css'
})
export class PaymentOptionsComponent {
  formData = {
    car: '',
    paymentMethod: 'Credit Card',
    fullname: '',
    phone: '',
    email: '',
    address: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
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

  get processingText(): string {
    if (
      this.formData.paymentMethod === 'Cash' ||
      this.formData.paymentMethod === 'In-Dealership Purchase'
    ) {
      return 'Finalize at dealership';
    }

    if (this.formData.paymentMethod === 'Bank Transfer') {
      return 'Dealership review required';
    }

    return 'Online request';
  }

  get needsCard(): boolean {
    return !['Cash', 'In-Dealership Purchase'].includes(this.formData.paymentMethod);
  }

  submitPayment(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.formData.car ||
      !this.formData.fullname ||
      !this.formData.phone ||
      !this.formData.email ||
      !this.formData.address ||
      !this.formData.paymentMethod
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.needsCard) {
      if (!this.formData.cardName || !this.formData.cardNumber || !this.formData.expiry || !this.formData.cvv) {
        this.errorMessage = 'Please fill in all card details.';
        return;
      }
    }

    const payload = {
      fullName: this.formData.fullname.trim(),
      email: this.formData.email.trim().toLowerCase(),
      phone: this.formData.phone.trim(),
      address: this.formData.address.trim(),
      vehicle: this.formData.car.trim(),
      paymentMethod: this.formData.paymentMethod,
      cardName: this.formData.cardName.trim(),
      cardNumber: this.formData.cardNumber.trim(),
      expiry: this.formData.expiry.trim(),
      cvv: this.formData.cvv.trim(),
      notes: this.formData.notes.trim()
    };

    this.isLoading = true;

    this.http.post<any>(`${this.API_BASE}/api/payment`, payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Payment request submitted successfully.';

        this.router.navigate(['/payment-confirmation'], {
          state: {
            ...payload,
            processingText: this.processingText
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to submit payment request.';
      }
    });
  }
}