import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';

interface InventoryCar {
  key: string;
  title: string;
  mileage: string;
  transmission: string;
  engine: string;
  color: string;
  price: string;
  image: string;
  search: string;
}

interface Review {
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inventory.html',
  styleUrls: ['./inventory.css']
})
export class InventoryComponent implements OnInit {
  searchValue = '';
  resultsText = '';
  pageSubtitle = 'Browse all 14 vehicles currently listed on SpeedBuyCars';
  externalSearchVisible = false;
  externalSearchText = '';

  cars: InventoryCar[] = [
    { key: 'mustang', title: '2020 Ford Mustang', mileage: '18,000 miles', transmission: 'Automatic', engine: '5.0L V8', color: 'Red Exterior / Black Interior', price: '$25,500', image: 'assets/cars/2020-ford-mustang-gt.jpeg', search: '2020 ford mustang 18000 automatic 5.0l v8 red black coupe performance $25,500' },
    { key: 'bmw330i', title: '2019 BMW 330i', mileage: '24,000 miles', transmission: 'Automatic', engine: '2.0L Turbo', color: 'Gray Exterior / Black Interior', price: '$21,900', image: 'assets/cars/bmw.jpeg', search: '2019 bmw 330i 24000 automatic 2.0l turbo gray black sedan luxury $21,900' },
    { key: 'rav4', title: '2021 Toyota RAV4', mileage: '15,000 miles', transmission: 'Automatic', engine: '2.5L 4-Cylinder', color: 'White Exterior / Gray Interior', price: '$22,700', image: 'assets/cars/toyo.jpeg', search: '2021 toyota rav4 15000 automatic 2.5l 4-cylinder white gray suv reliable $22,700' },
    { key: 'civic', title: '2018 Honda Civic', mileage: '30,000 miles', transmission: 'Automatic', engine: '2.0L 4-Cylinder', color: 'Blue Exterior / Black Interior', price: '$18,000', image: 'assets/cars/hondabump.jpeg', search: '2018 honda civic 30000 automatic 2.0l 4-cylinder blue black sedan fuel efficient $18,000' },
    { key: 'tesla3', title: '2022 Tesla Model 3', mileage: '10,000 miles', transmission: 'Automatic', engine: 'Electric', color: 'Black Exterior / White Interior', price: '$35,000', image: 'assets/cars/tesla.jpeg', search: '2022 tesla model 3 10000 automatic electric black white sedan ev $35,000' },
    { key: 'audia4', title: '2017 Audi A4', mileage: '40,000 miles', transmission: 'Automatic', engine: '2.0L Turbo', color: 'White Exterior / Beige Interior', price: '$19,50₀', image: 'assets/cars/audi.jpeg', search: '2₀₁₇ audi a4 4₀₀₀₀ automatic ₂.₀l turbo white beige sedan luxury $₁₉,₅₀₀' },
    { key: 'c3₀₀', title: '₂₀₂₀ Mercedes-Benz C₃₀₀', mileage: '₂₂,₀₀₀ miles', transmission: 'Automatic', engine: '₂.₀L Turbo', color: 'Black Exterior / Tan Interior', price: '$₂₉,₀₀₀', image: 'assets/cars/mercedes.jpeg', search: '₂₀₂₀ mercedes benz c₃₀₀ ₂₂,₀₀₀ automatic ₂.₀l turbo black tan sedan luxury $₂₉,₀₀₀' },
    { key: 'altima', title: '2021 Nissan Altima', mileage: '17,000 miles', transmission: 'Automatic', engine: '2.5L 4-Cylinder', color: 'Silver Exterior / Black Interior', price: '$20,000', image: 'assets/cars/nissan.jpeg', search: '2021 nissan altima 17000 automatic 2.5l 4-cylinder silver black sedan $20,000' },
    { key: 'wrangler', title: '2019 Jeep Wrangler', mileage: '28,000 miles', transmission: 'Automatic', engine: '3.6L V6', color: 'Green Exterior / Black Interior', price: '$28,500', image: 'assets/cars/jeep.jpeg', search: '2019 jeep wrangler 28000 automatic 3.6l v6 green black suv off road $28,500' },
    { key: 'accord', title: '2022 Honda Accord', mileage: '12,000 miles', transmission: 'Automatic', engine: '1.5L Turbo', color: 'White Exterior / Black Interior', price: '$27,000', image: 'assets/cars/accord.jpeg', search: '2022 honda accord 12000 automatic 1.5l turbo white black sedan $27,000' },
    { key: 'sportage', title: '2024 Kia Sportage', mileage: '8,000 miles', transmission: 'Automatic', engine: '2.5L 4-Cylinder', color: 'Blue Exterior / Black Interior', price: '$24,000', image: 'assets/cars/kia.jpeg', search: '2024 kia sportage 8000 automatic 2.5l 4-cylinder blue black suv $24,000' },
    { key: 'outback', title: '2018 Subaru Outback', mileage: '35,000 miles', transmission: 'Automatic', engine: '2.5L AWD', color: 'Gray Exterior / Black Interior', price: '$20,500', image: 'assets/cars/subaru.jpeg', search: '2018 subaru outback 35000 automatic 2.5l awd gray black wagon $20,500' },
    { key: 'camaro', title: '2023 Chevrolet Camaro', mileage: '5,000 miles', transmission: 'Automatic', engine: '6.2L V8', color: 'Yellow Exterior / Black Interior', price: '$36,000', image: 'assets/cars/chevy.jpeg', search: '2023 chevrolet camaro 5000 automatic 6.2l v8 yellow black coupe sport $36,000' },
    { key: 'lexusrx', title: '2020 Lexus RX 350', mileage: '18,000 miles', transmission: 'Automatic', engine: '3.5L V6', color: 'White Exterior / Beige Interior', price: '$31,000', image: 'assets/cars/lexi.jpeg', search: '2020 lexus rx 350 18000 automatic 3.5l v6 white beige suv luxury $31,000' }
  ];

  filteredCars: InventoryCar[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchValue = params['search'] || '';
      this.filterCars(this.searchValue);
    });
  }

  onHeaderSearch(value: string): void {
    this.searchValue = value;
    this.filterCars(value);
  }

  onHeaderSearchChanged(value: string): void {
    this.searchValue = value;
    this.filterCars(value);
  }

  filterCars(query: string): void {
    const cleanQuery = query.trim().toLowerCase();

    this.filteredCars = this.cars.filter(car => !cleanQuery || car.search.includes(cleanQuery));
    this.resultsText = `Showing ${this.filteredCars.length} of ${this.cars.length} vehicles`;

    if (cleanQuery) {
      this.pageSubtitle = `Search results for "${query}"`;
      this.externalSearchVisible = true;
      this.externalSearchText = this.filteredCars.length
        ? `Showing matching cars on this website for "${query}". You can also search more cars outside the website in Google.`
        : `No cars matched "${query}" on this website. Search Google for more cars outside the website.`;
      this.router.navigate([], { queryParams: { search: query }, queryParamsHandling: 'merge' });
    } else {
      this.pageSubtitle = 'Browse all 14 vehicles currently listed on SpeedBuyCars';
      this.externalSearchVisible = false;
      this.router.navigate([], { queryParams: {} });
    }
  }

  clearSearch(): void {
    this.searchValue = '';
    this.filterCars('');
  }

  goToDetails(key: string): void {
    this.router.navigate(['/car-details'], { queryParams: { car: key } });
  }

  openExternalSearch(): void {
    const googleQuery = `${this.searchValue.trim()} cars for sale`;
    window.open('https://www.google.com/search?q=' + encodeURIComponent(googleQuery), '_blank');
  }

  containsBlockedWordsInventory(text: string): boolean {
    const bannedWords = ['badword', 'stupid', 'idiot', 'hate', 'trash', 'garbage', 'scam', 'fraud', 'fake', 'ugly', 'worst', 'dumb', 'hell', 'damn'];
    const cleanText = String(text || '').toLowerCase();
    return bannedWords.some(word => cleanText.includes(word));
  }

  getApprovedReviewsForCar(carKey: string): Review[] {
    const storageKey = `speedBuyCarsReviews_${carKey}`;
    const stored = localStorage.getItem(storageKey);
    const reviews: Review[] = stored ? JSON.parse(stored) : [];

    const approvedReviews = reviews.filter(review => {
      if (!review || typeof review.rating !== 'number') return false;
      if (review.rating < 3) return false;
      if (!review.comment || !review.comment.trim()) return false;
      if (this.containsBlockedWordsInventory(review.comment)) return false;
      return true;
    });

    if (approvedReviews.length !== reviews.length) {
      localStorage.setItem(storageKey, JSON.stringify(approvedReviews));
    }

    return approvedReviews;
  }

  renderInventoryStars(rating: number): string {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
      stars += i <= rating ? '★' : '☆';
    }
    return stars;
  }

  getRatingSummary(carKey: string): { stars: string; text: string; count: string } {
    const reviews = this.getApprovedReviewsForCar(carKey);

    if (!reviews.length) {
      return { stars: '☆☆☆☆☆', text: 'No reviews yet', count: '0 approved reviews' };
    }

    const average = reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length;
    const rounded = Math.round(average);

    return {
      stars: this.renderInventoryStars(rounded),
      text: `${average.toFixed(1)} / 5`,
      count: `${reviews.length} approved review${reviews.length === 1 ? '' : 's'}`
    };
  }
}
