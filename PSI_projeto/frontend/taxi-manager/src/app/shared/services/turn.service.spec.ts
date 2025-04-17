import { TestBed } from '@angular/core/testing';

import { TurnService } from '@shared/services/turn.service';

describe('TaxiRequestService', () => {
  let service: TurnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TurnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
