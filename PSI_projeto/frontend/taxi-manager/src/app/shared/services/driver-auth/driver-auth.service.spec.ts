import { TestBed } from '@angular/core/testing';

import { DriverAuthService } from './driver-auth.service';

describe('DriverAuthService', () => {
  let service: DriverAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DriverAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
