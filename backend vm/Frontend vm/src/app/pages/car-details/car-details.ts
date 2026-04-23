import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

interface CarDetail {
  title: string;
  subtitle: string;
  price: string;
  image: string;
  specs: string[];
  features: string[];
  condition: string;
}

interface Review {
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './car-details.html',
  styleUrls: ['./car-details.css']
})
export class CarDetailsComponent implements OnInit {
  searchValue = '';
  selectedRating = 0;
  reviewComment = '';
  reviewMessage = '';
  reviewMessageType: 'success' | 'error' | '' = '';

  financeItems = [
    'Credit Card',
    'Debit Card',
    'MasterCard',
    'Bank Transfer',
    'Cash',
    'In-Dealership Purchase'
  ];

  termItems = [
    'Price is subject to change without notice',
    'Vehicle availability may vary by dealership',
    'Test drive by appointment only',
    'Final payment handled through dealership',
    'Taxes and registration fees not included'
  ];

  contactItems = [
    'Phone: (555) 123-4567',
    'Email: sales@speedbuycars.com',
    'Website: www.speedbuycars.com',
    'Address: 123 Auto Drive, Newark, NJ 07102'
  ];

  cars: Record<string, CarDetail> = {
    mustang: { title: '2020 FORD MUSTANG', subtitle: 'Performance Coupe | Premium Condition', price: '$25,500', image: 'assets/cars/2020-ford-mustang-gt.jpeg', specs: ['Year: 2020', 'Make: Ford', 'Model: Mustang', 'Mileage: 18,000 miles', 'Transmission: Automatic', 'Engine: 5.0L V8', 'Fuel Type: Gasoline', 'Color: Red Exterior / Black Interior'], features: ['Leather seats', 'Backup camera', 'Bluetooth', 'Touchscreen display', 'Push-button start'], condition: 'This 2020 Ford Mustang is in excellent condition with low mileage and strong performance.' },
    bmw330i: { title: '2019 BMW 330I', subtitle: 'Luxury Sedan | Premium Condition', price: '$21,900', image: 'assets/cars/bmw.jpeg', specs: ['Year: 2019', 'Make: BMW', 'Model: 330i', 'Mileage: 24,000 miles', 'Transmission: Automatic', 'Engine: 2.0L Turbo', 'Fuel Type: Gasoline', 'Color: Gray Exterior / Black Interior'], features: ['Sunroof', 'Leather interior', 'Bluetooth', 'Backup camera', 'Dual climate control'], condition: 'Clean and well-maintained luxury sedan with modern comfort and technology.' },
    rav4: { title: '2021 TOYOTA RAV4', subtitle: 'Reliable SUV | Excellent Daily Driver', price: '$22,700', image: 'assets/cars/toyo.jpeg', specs: ['Year: 2021', 'Make: Toyota', 'Model: RAV4', 'Mileage: 15,000 miles', 'Transmission: Automatic', 'Engine: 2.5L 4-Cylinder', 'Fuel Type: Gasoline', 'Color: White Exterior / Gray Interior'], features: ['Apple CarPlay', 'Lane assist', 'Backup camera', 'Keyless entry', 'All-weather capability'], condition: 'Low-mileage SUV in strong condition, ideal for commuting and family use.' },
    civic: { title: '2018 HONDA CIVIC', subtitle: 'Fuel Efficient Sedan | Smart Value', price: '$18,000', image: 'assets/cars/hondabump.jpeg', specs: ['Year: 2018', 'Make: Honda', 'Model: Civic', 'Mileage: 30,000 miles', 'Transmission: Automatic', 'Engine: 2.0L 4-Cylinder', 'Fuel Type: Gasoline', 'Color: Blue Exterior / Black Interior'], features: ['Bluetooth', 'Rear camera', 'Cruise control', 'Touchscreen display', 'Great fuel economy'], condition: 'Reliable and efficient sedan with a clean interior and practical features.' },
    tesla3: { title: '2022 TESLA MODEL 3', subtitle: 'Electric Sedan | Modern Technology', price: '$35,000', image: 'assets/cars/tesla.jpeg', specs: ['Year: 2022', 'Make: Tesla', 'Model: Model 3', 'Mileage: 10,000 miles', 'Transmission: Automatic', 'Engine: Electric', 'Fuel Type: Electric', 'Color: Black Exterior / White Interior'], features: ['Large infotainment screen', 'Autopilot-ready', 'Premium cabin', 'Fast acceleration', 'Zero-emission driving'], condition: 'Sharp modern EV with low miles, impressive range, and clean styling.' },
    audia4: { title: '2017 AUDI A4', subtitle: 'Luxury Sedan | Turbocharged', price: '$19,500', image: 'assets/cars/audi.jpeg', specs: ['Year: 2017', 'Make: Audi', 'Model: A4', 'Mileage: 40,000 miles', 'Transmission: Automatic', 'Engine: 2.0L Turbo', 'Fuel Type: Gasoline', 'Color: White Exterior / Beige Interior'], features: ['Leather seats', 'Sunroof', 'Premium audio', 'Dual-zone climate', 'Audi drive select'], condition: 'Refined European sedan with premium comfort and smooth turbo performance.' },
    c300: { title: '2020 MERCEDES-BENZ C300', subtitle: 'Luxury Sedan | Premium Feel', price: '$29,000', image: 'assets/cars/mercedes.jpeg', specs: ['Year: 2020', 'Make: Mercedes-Benz', 'Model: C300', 'Mileage: 22,000 miles', 'Transmission: Automatic', 'Engine: 2.0L Turbo', 'Fuel Type: Gasoline', 'Color: Black Exterior / Tan Interior'], features: ['Heated seats', 'Large display', 'Ambient lighting', 'Backup camera', 'Luxury finish'], condition: 'Elegant sedan with excellent cabin quality and well-kept condition.' },
    altima: { title: '2021 NISSAN ALTIMA', subtitle: 'Midsize Sedan | Comfortable Ride', price: '$20,000', image: 'assets/cars/nissan.jpeg', specs: ['Year: 2021', 'Make: Nissan', 'Model: Altima', 'Mileage: 17,000 miles', 'Transmission: Automatic', 'Engine: 2.5L 4-Cylinder', 'Fuel Type: Gasoline', 'Color: Silver Exterior / Black Interior'], features: ['Apple CarPlay', 'Blind spot warning', 'Remote start', 'Cloth interior', 'Modern dashboard'], condition: 'Comfortable and efficient sedan with low mileage and a clean interior.' },
    wrangler: { title: '2019 JEEP WRANGLER', subtitle: 'Adventure SUV | Rugged Capability', price: '$28,500', image: 'assets/cars/jeep.jpeg', specs: ['Year: 2019', 'Make: Jeep', 'Model: Wrangler', 'Mileage: 28,000 miles', 'Transmission: Automatic', 'Engine: 3.6L V6', 'Fuel Type: Gasoline', 'Color: Green Exterior / Black Interior'], features: ['4x4 capability', 'Removable top', 'All-terrain tires', 'Touchscreen display', 'Tow hooks'], condition: 'Strong off-road SUV in solid condition and ready for adventure.' },
    accord: { title: '2022 HONDA ACCORD', subtitle: 'Modern Sedan | Comfortable and Clean', price: '$27,000', image: 'assets/cars/accord.jpeg', specs: ['Year: 2022', 'Make: Honda', 'Model: Accord', 'Mileage: 12,000 miles', 'Transmission: Automatic', 'Engine: 1.5L Turbo', 'Fuel Type: Gasoline', 'Color: White Exterior / Black Interior'], features: ['Spacious cabin', 'Bluetooth', 'Backup camera', 'Apple CarPlay', 'Smart entry'], condition: 'Excellent daily-driver sedan with modern design and low mileage.' },
    sportage: { title: '2024 KIA SPORTAGE', subtitle: 'Fresh SUV | Stylish and Practical', price: '$24,000', image: 'assets/cars/kia.jpeg', specs: ['Year: 2024', 'Make: Kia', 'Model: Sportage', 'Mileage: 8,000 miles', 'Transmission: Automatic', 'Engine: 2.5L 4-Cylinder', 'Fuel Type: Gasoline', 'Color: Blue Exterior / Black Interior'], features: ['Large cargo area', 'Apple CarPlay', 'Modern styling', 'Safety features', 'Low mileage'], condition: 'Very clean nearly-new SUV with practical features and bold styling.' },
    outback: { title: '2018 SUBARU OUTBACK', subtitle: 'AWD Wagon | Everyday Utility', price: '$20,500', image: 'assets/cars/subaru.jpeg', specs: ['Year: 2018', 'Make: Subaru', 'Model: Outback', 'Mileage: 35,000 miles', 'Transmission: Automatic', 'Engine: 2.5L AWD', 'Fuel Type: Gasoline', 'Color: Gray Exterior / Black Interior'], features: ['AWD', 'Roof rails', 'Rear camera', 'Large cargo area', 'All-weather capability'], condition: 'Versatile wagon with dependable all-wheel drive and useful interior space.' },
    camaro: { title: '2023 CHEVROLET CAMARO', subtitle: 'V8 Coupe | Sport Performance', price: '$36,000', image: 'assets/cars/chevy.jpeg', specs: ['Year: 2023', 'Make: Chevrolet', 'Model: Camaro', 'Mileage: 5,000 miles', 'Transmission: Automatic', 'Engine: 6.2L V8', 'Fuel Type: Gasoline', 'Color: Yellow Exterior / Black Interior'], features: ['Sport exhaust', 'Performance seats', 'Touchscreen display', 'Rear camera', 'Strong V8 performance'], condition: 'Low-mileage performance coupe with bold styling and powerful engine.' },
    lexusrx: { title: '2020 LEXUS RX 350', subtitle: 'Luxury SUV | Smooth and Comfortable', price: '$31,000', image: 'assets/cars/lexi.jpeg', specs: ['Year: 2020', 'Make: Lexus', 'Model: RX 350', 'Mileage: 18,000 miles', 'Transmission: Automatic', 'Engine: 3.5L V6', 'Fuel Type: Gasoline', 'Color: White Exterior / Beige Interior'], features: ['Premium cabin', 'Power liftgate', 'Large touchscreen', 'Blind spot monitoring', 'Comfort ride'], condition: 'Luxury SUV in excellent condition with smooth ride quality and premium interior.' }
  };

  carKey = 'mustang';
  car: CarDetail = this.cars['mustang'];
  reviews: Review[] = [];
  currentUser: { fullName: string; email: string; loggedIn: boolean } | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem('speedBuyCarsCurrentUser') || 'null');

    this.route.queryParams.subscribe(params => {
      this.carKey = params['car'] || 'mustang';
      this.car = this.cars[this.carKey] || this.cars['mustang'];
      this.loadReviews();
    });
  }

  onHeaderSearch(value: string): void {
    this.searchValue = value.trim();
    if (!this.searchValue) {
      alert('Please enter a car name, year, make, or model.');
      return;
    }

    const matches = Object.entries(this.cars).filter(([key, car]) => {
      const searchableText = [key, car.title, car.subtitle, car.price, ...(car.specs || []), ...(car.features || [])].join(' ').toLowerCase();
      return searchableText.includes(this.searchValue.toLowerCase());
    });

    if (matches.length === 1) {
      this.router.navigate(['/car-details'], { queryParams: { car: matches[0][0] } });
    } else if (matches.length > 1) {
      this.router.navigate(['/inventory'], { queryParams: { search: this.searchValue } });
    } else {
      alert('No available car matched your search.');
    }
  }

  selectRating(value: number): void {
    this.selectedRating = value;
  }

  loadReviews(): void {
    const reviewStorageKey = `speedBuyCarsReviews_${this.carKey || 'mustang'}`;
    this.reviews = JSON.parse(localStorage.getItem(reviewStorageKey) || '[]');
  }

  containsBlockedWords(text: string): boolean {
    const bannedWords = ['badword', 'stupid', 'idiot', 'hate', 'trash', 'garbage', 'scam', 'fraud', 'fake', 'ugly', 'worst', 'dumb', 'hell', 'damn'];
    const cleanText = String(text || '').toLowerCase();
    return bannedWords.some(word => cleanText.includes(word));
  }

  get approvedReviews(): Review[] {
    const approved = this.reviews.filter(review => {
      if (!review || typeof review.rating !== 'number') return false;
      if (review.rating < 3) return false;
      if (!review.comment || !review.comment.trim()) return false;
      if (this.containsBlockedWords(review.comment)) return false;
      return true;
    });

    if (approved.length !== this.reviews.length) {
      localStorage.setItem(`speedBuyCarsReviews_${this.carKey || 'mustang'}`, JSON.stringify(approved));
      this.reviews = approved;
    }

    return approved;
  }

  get averageRating(): number {
    if (!this.approvedReviews.length) return 0;
    return this.approvedReviews.reduce((sum, review) => sum + review.rating, 0) / this.approvedReviews.length;
  }

  get averageRatingStars(): string {
    const rounded = Math.round(this.averageRating);
    let stars = '';
    for (let i = 1; i <= 5; i++) stars += i <= rounded ? '★' : '☆';
    return stars || '☆☆☆☆☆';
  }

  get selectedRatingText(): string {
    return `Selected Rating: ${this.selectedRating} Stars`;
  }

  submitReview(): void {
    this.reviewMessage = '';
    this.reviewMessageType = '';

    if (!this.currentUser?.loggedIn) {
      this.reviewMessage = 'Please login first to submit a review.';
      this.reviewMessageType = 'error';
      return;
    }

    if (this.selectedRating < 1 || this.selectedRating > 5) {
      this.reviewMessage = 'Please select a rating from 1 to 5 stars.';
      this.reviewMessageType = 'error';
      return;
    }

    const comment = this.reviewComment.trim();
    if (!comment) {
      this.reviewMessage = 'Please write a comment before submitting.';
      this.reviewMessageType = 'error';
      return;
    }

    if (this.selectedRating < 3) {
      this.reviewMessage = 'Ratings below 3 stars are not accepted on this demo website.';
      this.reviewMessageType = 'error';
      return;
    }

    if (this.containsBlockedWords(comment)) {
      this.reviewMessage = 'Your comment includes blocked words and was not accepted.';
      this.reviewMessageType = 'error';
      return;
    }

    const reviewStorageKey = `speedBuyCarsReviews_${this.carKey || 'mustang'}`;
    const newReview: Review = {
      userName: this.currentUser.fullName,
      rating: this.selectedRating,
      comment,
      date: new Date().toLocaleDateString()
    };

    const updatedReviews = [...this.reviews, newReview];
    localStorage.setItem(reviewStorageKey, JSON.stringify(updatedReviews));
    this.reviews = updatedReviews;
    this.selectedRating = 0;
    this.reviewComment = '';
    this.reviewMessage = 'Review submitted successfully.';
    this.reviewMessageType = 'success';
  }

  getStars(rating: number): string {
    let stars = '';
    for (let i = 1; i <= 5; i++) stars += i <= rating ? '★' : '☆';
    return stars;
  }

  openPayment(): void {
    this.router.navigate(['/financing'], { queryParams: { car: this.carKey } });
  }

  openQuote(): void {
    this.router.navigate(['/get-quote'], { queryParams: { car: this.carKey } });
  }
}
