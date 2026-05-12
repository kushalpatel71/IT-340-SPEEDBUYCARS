import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quote-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quote-confirmation.html',
  styleUrls: ['./quote-confirmation.css']
})
export class QuoteConfirmationComponent implements OnInit {
  quoteData: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const stateData = nav?.extras?.state;

    if (stateData) {
      this.quoteData = stateData;
      localStorage.setItem('speedbuycarsQuote', JSON.stringify(stateData));
      return;
    }

    const savedQuote = localStorage.getItem('speedbuycarsQuote');
    this.quoteData = savedQuote ? JSON.parse(savedQuote) : null;
  }

  returnHome(): void {
    this.router.navigate(['/']);
  }
}