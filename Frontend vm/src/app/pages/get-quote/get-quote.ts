import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-get-quote',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './get-quote.html',
  styleUrls: ['./get-quote.css']
})
export class GetQuoteComponent implements OnInit {
  formData = {
    fullname: '',
    email: '',
    phone: '',
    car: '',
    notes: ''
  };

  cars = [
    { value: 'mustang', label: '2020 Ford Mustang' },
    { value: 'bmw330i', label: '2019 BMW 330i' },
    { value: 'rav4', label: '2021 Toyota RAV4' },
    { value: 'civic', label: '2018 Honda Civic' },
    { value: 'tesla3', label: '2022 Tesla Model 3' },
    { value: 'camaro', label: '2023 Chevrolet Camaro' },
    { value: 'lexusrx', label: '2020 Lexus RX 350' }
  ];

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
      if (params['car']) this.formData.car = params['car'];
    });
  }

  submitQuote(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.formData.fullname || !this.formData.email || !this.formData.phone || !this.formData.car) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const selectedCar = this.cars.find(c => c.value === this.formData.car);

    const payload = {
      fullName: this.formData.fullname.trim(),
      email: this.formData.email.trim().toLowerCase(),
      phone: this.formData.phone.trim(),
      vehicle: selectedCar ? selectedCar.label : this.formData.car,
      message: this.formData.notes.trim()
    };

    this.isLoading = true;

    this.http.post<any>(`${this.API_BASE}/api/quote`, payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message || 'Quote request submitted successfully.';
        this.router.navigate(['/quote-confirmation'], {
          state: {
            fullName: payload.fullName,
            email: payload.email,
            phone: payload.phone,
            vehicle: payload.vehicle,
            message: payload.message
          }
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Failed to submit quote request.';
      }
    });
  }
}