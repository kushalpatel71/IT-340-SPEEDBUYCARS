import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize, timeout } from 'rxjs/operators';

@Component({
  selector: 'app-payment-options',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
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

  private API_BASE = 'http://192.168.165.138:5000';

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
    return ['Credit Card', 'Debit Card', 'MasterCard'].includes(this.formData.paymentMethod);
  }

  submitPayment(): void {
    if (this.isLoading) return;

    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.formData.car.trim() ||
      !this.formData.fullname.trim() ||
      !this.formData.phone.trim() ||
      !this.formData.email.trim() ||
      !this.formData.address.trim() ||
      !this.formData.paymentMethod
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.needsCard) {
      if (
        !this.formData.cardName.trim() ||
        !this.formData.cardNumber.trim() ||
        !this.formData.expiry.trim() ||
        !this.formData.cvv.trim()
      ) {
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

    this.http.post<any>(`${this.API_BASE}/api/payment`, payload)
      .pipe(
        timeout(10000),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.successMessage = response.message || 'Payment request submitted successfully.';

          this.router.navigate(['/payment-confirmation'], {
            state: {
              ...payload,
              processingText: this.processingText
            }
          });
        },
        error: (error) => {
          console.error('payment error:', error);

          if (error.name === 'TimeoutError') {
            this.errorMessage = 'Request timed out. Check backend server and email sending.';
          } else if (error.status === 0) {
            this.errorMessage = 'Cannot connect to backend. Check backend IP, port, and CORS.';
          } else {
            this.errorMessage = error.error?.message || 'Failed to submit payment request.';
          }
        }
      });
  }
}