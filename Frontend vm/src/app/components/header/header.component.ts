import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: any = null;
  isLoggedIn = false;

  dropdownOpen = false;

  showSearch = false;
  searchValue = '';
  searchPlaceholder = 'Search cars...';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadUser();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUser();
        this.dropdownOpen = false;
      });
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  loadUser(): void {
    if (!this.isBrowser()) return;

    const token = localStorage.getItem('speedbuycars_token');
    const savedUser = localStorage.getItem('speedbuycars_user');

    this.isLoggedIn = !!token;

    if (token && savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch {
        this.currentUser = null;
      }
    } else {
      this.currentUser = null;
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('speedbuycars_token');
      localStorage.removeItem('speedbuycars_user');
    }

    this.currentUser = null;
    this.isLoggedIn = false;
    this.dropdownOpen = false;

    this.router.navigate(['/login']);
  }

  onSearchInput(): void {
    // optional live search placeholder
  }

  onSearchSubmit(): void {
    const query = this.searchValue.trim();

    if (!query) {
      return;
    }

    this.router.navigate(['/inventory'], {
      queryParams: { q: query }
    });
  }
}