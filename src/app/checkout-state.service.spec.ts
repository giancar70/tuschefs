import { TestBed } from '@angular/core/testing';

import { CheckoutStateService } from './checkout-state.service';

describe('CheckoutStateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckoutStateService = TestBed.get(CheckoutStateService);
    expect(service).toBeTruthy();
  });
});
