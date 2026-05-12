import { TestBed } from '@angular/core/testing';

import { Car } from './car';

describe('Car', () => {
  let service: Car;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Car);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
