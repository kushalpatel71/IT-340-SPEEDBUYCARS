import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sell-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sell-success.html',
  styleUrls: ['./sell-success.css']
})
export class SellSuccessComponent implements OnInit {
  data: any = {};

  constructor(private router: Router) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const stateData = nav?.extras?.state;

    if (stateData) {
      this.data = stateData;
      localStorage.setItem('sellSuccessData', JSON.stringify(stateData));
    } else {
      const savedData = localStorage.getItem('sellSuccessData');
      this.data = savedData ? JSON.parse(savedData) : {};
    }
  }
}