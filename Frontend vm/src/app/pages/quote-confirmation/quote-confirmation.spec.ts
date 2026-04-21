import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteConfirmation } from './quote-confirmation';

describe('QuoteConfirmation', () => {
  let component: QuoteConfirmation;
  let fixture: ComponentFixture<QuoteConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteConfirmation],
    }).compileComponents();

    fixture = TestBed.createComponent(QuoteConfirmation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
