import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sell-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sell-success.html',
  styleUrls: ['./sell-success.css']
})
export class SellSuccessComponent implements OnInit {
  data: any = {};

  ngOnInit(): void {
    this.data = history.state || {};
  }
}