import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetQuote } from './get-quote';

describe('GetQuote', () => {
  let component: GetQuote;
  let fixture: ComponentFixture<GetQuote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetQuote],
    }).compileComponents();

    fixture = TestBed.createComponent(GetQuote);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
