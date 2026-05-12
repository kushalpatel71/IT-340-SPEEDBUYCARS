import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

import { PaymentOptionsComponent } from './pages/payment-options/payment-options';
import { PaymentConfirmationComponent } from './pages/payment-confirmation/payment-confirmation';
import { HomeComponent } from './pages/home/home';
import { InventoryComponent } from './pages/inventory/inventory';
import { CarDetailsComponent } from './pages/car-details/car-details';
import { AboutComponent } from './pages/about/about';
import { ContactComponent } from './pages/contact/contact';
import { GetQuoteComponent } from './pages/get-quote/get-quote';
import { QuoteConfirmationComponent } from './pages/quote-confirmation/quote-confirmation';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { SellYourCarComponent } from './pages/sell-your-car/sell-your-car';
import { SellSuccessComponent } from './pages/sell-success/sell-success';

export const routes: Routes = [
  // Public pages
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Protected pages
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'inventory', component: InventoryComponent, canActivate: [authGuard] },
  { path: 'car-details', component: CarDetailsComponent, canActivate: [authGuard] },
  { path: 'about', component: AboutComponent, canActivate: [authGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [authGuard] },
  { path: 'get-quote', component: GetQuoteComponent, canActivate: [authGuard] },
  { path: 'quote-confirmation', component: QuoteConfirmationComponent, canActivate: [authGuard] },
  { path: 'sell-your-car', component: SellYourCarComponent, canActivate: [authGuard] },
  { path: 'sell-success', component: SellSuccessComponent, canActivate: [authGuard] },
  { path: 'payment-options', component: PaymentOptionsComponent, canActivate: [authGuard] },
  { path: 'payment-confirmation', component: PaymentConfirmationComponent, canActivate: [authGuard] },

  // Anything else goes to login
  { path: '**', redirectTo: 'login' }
];