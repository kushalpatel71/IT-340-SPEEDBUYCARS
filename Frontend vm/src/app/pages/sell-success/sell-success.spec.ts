import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellSuccess } from './sell-success';

describe('SellSuccess', () => {
  let component: SellSuccess;
  let fixture: ComponentFixture<SellSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellSuccess],
    }).compileComponents();

    fixture = TestBed.createComponent(SellSuccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
