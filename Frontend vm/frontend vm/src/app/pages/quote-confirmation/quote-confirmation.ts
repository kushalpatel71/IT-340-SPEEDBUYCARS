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
    const savedQuote = localStorage.getItem('speedbuycarsQuote');

    if (savedQuote) {
      this.quoteData = JSON.parse(savedQuote);
    } else {
      this.quoteData = null;
    }
  }

  returnHome(): void {
    this.router.navigate(['/']);
  }
}