import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { SellYourCarComponent } from './sell-your-car';

describe('SellYourCar', () => {
let component: SellYourCarComponent;
let fixture: ComponentFixture<SellYourCarComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
     imports: [SellYourCarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SellYourCarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
