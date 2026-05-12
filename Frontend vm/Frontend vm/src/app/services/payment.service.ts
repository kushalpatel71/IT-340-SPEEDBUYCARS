import { Injectable } from '@angular/core';

export interface PaymentFormData {
  car: string;
  paymentMethod: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  cardName?: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  notes?: string;
  processing: string;
  requestDate: string;
  confirmationNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private paymentData: PaymentFormData | null = null;

  setPaymentData(data: PaymentFormData): void {
    this.paymentData = data;
  }

  getPaymentData(): PaymentFormData | null {
    return this.paymentData;
  }

  clearPaymentData(): void {
    this.paymentData = null;
  }
}