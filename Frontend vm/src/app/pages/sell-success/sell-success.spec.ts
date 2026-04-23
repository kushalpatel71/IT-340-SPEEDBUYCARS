import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { SellSuccessComponent } from './sell-success';

describe('SellSuccessComponent', () => {
  let component: SellSuccessComponent;
  let fixture: ComponentFixture<SellSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellSuccessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SellSuccessComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});