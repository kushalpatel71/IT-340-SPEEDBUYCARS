import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellYourCar } from './sell-your-car';

describe('SellYourCar', () => {
  let component: SellYourCar;
  let fixture: ComponentFixture<SellYourCar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellYourCar],
    }).compileComponents();

    fixture = TestBed.createComponent(SellYourCar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
