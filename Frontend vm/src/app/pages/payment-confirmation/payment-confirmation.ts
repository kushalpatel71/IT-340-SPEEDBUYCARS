import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-payment-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-confirmation.html',
  styleUrl: './payment-confirmation.css'
})
export class PaymentConfirmationComponent implements OnInit {
  paymentData: any = null;

  ngOnInit(): void {
    this.paymentData = history.state || null;
  }

  get processingText(): string {
    if (!this.paymentData) return 'Online request';

    if (
      this.paymentData.paymentMethod === 'Cash' ||
      this.paymentData.paymentMethod === 'In-Dealership Purchase'
    ) {
      return 'Finalize at dealership';
    }

    if (this.paymentData.paymentMethod === 'Bank Transfer') {
      return 'Dealership review required';
    }

    return 'Online request';
  }

  get maskedCard(): string {
    if (!this.paymentData?.cardNumber) return 'Not applicable';
    const clean = this.paymentData.cardNumber.replace(/\D/g, '');
    if (clean.length < 4) return '****';
    return '**** **** **** ' + clean.slice(-4);
  }
}