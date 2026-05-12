import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

interface WebsiteCar {
  year: number;
  make: string;
  model: string;
  trim: string;
  type: string;
  engine: string;
  transmission: string;
  price: string;
  detailsKey: string;
  image: string;
  blurb: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  searchValue = '';
  searchResults: WebsiteCar[] = [];
  noResults = false;
  showExternalSearch = false;
  externalSearchText = '';

  featuredCars: WebsiteCar[] = [
    { year: 2020, make: 'Ford', model: 'Mustang', trim: 'GT', type: 'Coupe', engine: '5.0L V8', transmission: 'Automatic', price: '$25,500', detailsKey: 'mustang', image: 'assets/images-cars/2020-ford-mustang-gt.jpeg', blurb: 'Sporty performance, premium interior, low mileage.' },
    { year: 2019, make: 'BMW', model: '330i', trim: 'Base', type: 'Sedan', engine: '2.0L Turbo', transmission: 'Automatic', price: '$21,900', detailsKey: 'bmw330i', image: 'assets/images-cars/bmw.jpeg', blurb: 'Luxury sedan with smooth handling and modern tech.' },
    { year: 2021, make: 'Toyota', model: 'RAV4', trim: 'Base', type: 'SUV', engine: '2.5L 4-Cylinder', transmission: 'Automatic', price: '$22,700', detailsKey: 'rav4', image: 'assets/images-cars/toyo.jpeg', blurb: 'Reliable SUV with low miles and daily comfort.' },
    { year: 2022, make: 'Tesla', model: 'Model 3', trim: 'Base', type: 'Sedan', engine: 'Electric', transmission: 'Automatic', price: '$35,000', detailsKey: 'tesla3', image: 'assets/images-cars/tesla.jpeg', blurb: 'Modern EV with clean styling and strong range.' },
    { year: 2023, make: 'Chevrolet', model: 'Camaro', trim: 'Base', type: 'Coupe', engine: '6.2L V8', transmission: 'Automatic', price: '$36,000', detailsKey: 'camaro', image: 'assets/images-cars/chevy.jpeg', blurb: 'Bold V8 power with standout yellow finish.' },
    { year: 2020, make: 'Lexus', model: 'RX 350', trim: 'Base', type: 'SUV', engine: '3.5L V6', transmission: 'Automatic', price: '$31,000', detailsKey: 'lexusrx', image: 'assets/images-cars/lexi.jpeg', blurb: 'Premium SUV with comfort-focused luxury design.' }
  ];

  websiteCars: WebsiteCar[] = [
    ...this.featuredCars,
    { year: 2018, make: 'Honda', model: 'Civic', trim: 'Base', type: 'Sedan', engine: '2.0L 4-Cylinder', transmission: 'Automatic', price: '$18,000', detailsKey: 'civic', image: 'assets/images-cars/hondabump.jpeg', blurb: 'Fuel-efficient daily driver with a clean design.' },
    { year: 2017, make: 'Audi', model: 'A4', trim: 'Base', type: 'Sedan', engine: '2.0L Turbo', transmission: 'Automatic', price: '$19,500', detailsKey: 'audia4', image: 'assets/images-cars/audi.jpeg', blurb: 'European comfort and turbocharged performance.' },
    { year: 2020, make: 'Mercedes-Benz', model: 'C300', trim: 'Base', type: 'Sedan', engine: '2.0L Turbo', transmission: 'Automatic', price: '$29,000', detailsKey: 'c300', image: 'assets/images-cars/mercedes.jpeg', blurb: 'Luxury styling with refined cabin quality.' },
    { year: 2021, make: 'Nissan', model: 'Altima', trim: 'Base', type: 'Sedan', engine: '2.5L 4-Cylinder', transmission: 'Automatic', price: '$20,000', detailsKey: 'altima', image: 'assets/images-cars/nissan.jpeg', blurb: 'Comfortable midsize sedan with sleek profile.' },
    { year: 2019, make: 'Jeep', model: 'Wrangler', trim: 'Sport', type: 'SUV', engine: '3.6L V6', transmission: 'Automatic', price: '$28,500', detailsKey: 'wrangler', image: 'assets/images-cars/jeep.jpeg', blurb: 'Adventure-ready SUV with rugged capability.' },
    { year: 2022, make: 'Honda', model: 'Accord', trim: 'Base', type: 'Sedan', engine: '1.5L Turbo', transmission: 'Automatic', price: '$27,000', detailsKey: 'accord', image: 'assets/images-cars/accord.jpeg', blurb: 'Roomy cabin with modern styling and comfort.' },
    { year: 2024, make: 'Kia', model: 'Sportage', trim: 'Base', type: 'SUV', engine: '2.5L 4-Cylinder', transmission: 'Automatic', price: '$24,000', detailsKey: 'sportage', image: 'assets/images-cars/kia.jpeg', blurb: 'Fresh SUV styling with practical space.' },
    { year: 2018, make: 'Subaru', model: 'Outback', trim: 'Base', type: 'Wagon', engine: '2.5L AWD', transmission: 'Automatic', price: '$20,500', detailsKey: 'outback', image: 'assets/images-cars/subaru.jpeg', blurb: 'All-weather wagon with dependable AWD.' }
  ];

  constructor(private router: Router) {}

  onHeaderSearch(value: string): void {
    this.searchValue = value;
    this.searchCars();
  }

  private normalizeText(text: string): string {
    return String(text).toLowerCase().replace(/\s+/g, ' ').trim();
  }

  private carMatchesQuery(car: WebsiteCar, query: string): boolean {
    const searchableText = `${car.year} ${car.make} ${car.model} ${car.trim} ${car.type} ${car.engine} ${car.transmission} ${car.price}`;
    return this.normalizeText(searchableText).includes(this.normalizeText(query));
  }

  searchCars(): void {
    const query = this.searchValue.trim();
    this.searchResults = [];
    this.noResults = false;
    this.showExternalSearch = false;
    this.externalSearchText = '';

    if (!query) {
      return;
    }

    this.searchResults = this.websiteCars.filter(car => this.carMatchesQuery(car, query));
    this.showExternalSearch = true;

    if (this.searchResults.length > 0) {
      this.externalSearchText = `Showing matching cars on this website for "${query}". You can also search more cars online.`;
    } else {
      this.noResults = true;
      this.externalSearchText = `No exact match found on this website for "${query}". Search more cars online.`;
    }
  }

  openExternalSearch(): void {
    const query = `${this.searchValue.trim()} cars for sale`;
    if (!query.trim()) return;
    window.open('https://www.google.com/search?q=' + encodeURIComponent(query), '_blank');
  }

  goToDetails(carKey: string): void {
    this.router.navigate(['/car-details'], { queryParams: { car: carKey } });
  }
}
