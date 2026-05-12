import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize, timeout } from 'rxjs/operators';

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

  private API_BASE = 'http://192.168.165.138:5000';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['car']) {
        this.formData.car = params['car'];
      }

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
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('speedbuycars_token');

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  submitQuote(): void {
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
      !this.formData.car.trim()
    ) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    const selectedCar = this.cars.find(c => c.value === this.formData.car);

    const payload = {
      fullName: this.formData.fullname.trim(),
      email: this.formData.email.trim().toLowerCase(),
      phone: this.formData.phone.trim(),
      vehicle: selectedCar ? selectedCar.label : this.formData.car,
      selectedCar: selectedCar ? selectedCar.label : this.formData.car,
      car: this.formData.car,
      message: this.formData.notes.trim(),
      notes: this.formData.notes.trim()
    };

    this.isLoading = true;

    this.http.post<any>(`${this.API_BASE}/api/quote`, payload, {
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
          console.log('quote response:', response);

          this.successMessage =
            response?.message || 'Quote request submitted successfully.';

          localStorage.setItem('speedbuycarsQuote', JSON.stringify(payload));

          setTimeout(() => {
            this.router.navigate(['/quote-confirmation'], {
              state: payload
            });
          }, 500);
        },
        error: (error) => {
          console.error('quote error:', error);

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
              error.error?.message || 'Failed to submit quote request.';
          }
        }
      });
  }
}