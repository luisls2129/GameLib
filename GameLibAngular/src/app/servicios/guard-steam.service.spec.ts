import { TestBed } from '@angular/core/testing';

import { GuardSteamService } from './guard-steam.service';

describe('GuardSteamService', () => {
  let service: GuardSteamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuardSteamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
