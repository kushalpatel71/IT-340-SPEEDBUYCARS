import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-financing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './financing.html',
  styleUrl: './financing.css'
})
export class FinancingComponent {
  vehicles = [
    '2020 Ford Mustang',
    '2019 BMW 330i',
    '2021 Toyota RAV4',
    '2018 Honda Civic',
    '2022 Tesla Model 3',
    '2017 Audi A4',
    '2020 Mercedes C300',
    '2016 Nissan Altima',
    '2021 Jeep Wrangler',
    '2019 Hyundai Elantra',
    '2022 Kia Sportage',
    '2018 Subaru Outback',
    '2023 Chevrolet Camaro',
    '2020 Lexus RX 350',
    '2021 Honda Accord'
  ];

  paymentMethods = [
    'Credit Card',
    'Debit Card',
    'MasterCard',
    'Bank Transfer',
    'Cash',
    'In-Dealership Purchase'
  ];

  formData = {
    selectedVehicle: '',
    paymentMethod: 'Credit Card',
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    address: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    additionalNotes: ''
  };

  errorMessage = '';
  successMessage = '';
  private API_BASE = 'http://192.168.79.143:5000';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  get summaryVehicle(): string {
    return this.formData.selectedVehicle || 'Not selected';
  }

  get summaryProcess(): string {
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

  submitPaymentRequest(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.formData.selectedVehicle ||
      !this.formData.fullName ||
      !this.formData.phoneNumber ||
      !this.formData.emailAddress ||
      !this.formData.address
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    if (this.needsCard) {
      if (!this.formData.cardName || !this.formData.cardNumber || !this.formData.expiryDate || !this.formData.cvv) {
        this.errorMessage = 'Please fill in all card details.';
        return;
      }
    }

    const payload = {
      fullName: this.formData.fullName.trim(),
      email: this.formData.emailAddress.trim().toLowerCase(),
      phone: this.formData.phoneNumber.trim(),
      address: this.formData.address.trim(),
      vehicle: this.formData.selectedVehicle.trim(),
      paymentMethod: this.formData.paymentMethod,
      cardName: this.formData.cardName.trim(),
      cardNumber: this.formData.cardNumber.trim(),
      expiry: this.formData.expiryDate.trim(),
      cvv: this.formData.cvv.trim(),
      notes: this.formData.additionalNotes.trim()
    };

    this.http.post<any>(`${this.API_BASE}/api/payment`, payload).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Payment request submitted successfully.';

        this.router.navigate(['/payment-confirmation'], {
          state: {
            ...payload,
            processingText: this.summaryProcess
          }
        });
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Failed to submit payment request.';
      }
    });
  }
}