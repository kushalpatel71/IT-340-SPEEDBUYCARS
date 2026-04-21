import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-quote-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quote-confirmation.html',
  styleUrls: ['./quote-confirmation.css']
})
export class QuoteConfirmationComponent {
  quoteData: any;

  constructor() {
    this.quoteData = history.state || {};
  }
}
