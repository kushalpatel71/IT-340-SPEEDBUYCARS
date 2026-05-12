import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() showSearch = false;
  @Input() searchValue = '';
  @Input() searchPlaceholder = 'Search cars...';

  @Output() searchChanged = new EventEmitter<string>();
  @Output() searchSubmitted = new EventEmitter<string>();

  currentUser: any = null;
  isBrowser = false;
  dropdownOpen = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadUser();
  }

  loadUser(): void {
    if (this.isBrowser) {
      const savedUser = localStorage.getItem('speedBuyCarsCurrentUser');
      this.currentUser = savedUser ? JSON.parse(savedUser) : null;
    }
  }

  onSearchInput(): void {
    this.searchChanged.emit(this.searchValue);
  }

  onSearchSubmit(): void {
    this.searchSubmitted.emit(this.searchValue);
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('speedBuyCarsCurrentUser');
      this.currentUser = null;
      this.dropdownOpen = false;
      window.location.href = '/login';
    }
  }
}