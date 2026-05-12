import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { QuoteConfirmationComponent } from './quote-confirmation';

describe('QuoteConfirmationComponent', () => {
  let component: QuoteConfirmationComponent;
  let fixture: ComponentFixture<QuoteConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteConfirmationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteConfirmationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});