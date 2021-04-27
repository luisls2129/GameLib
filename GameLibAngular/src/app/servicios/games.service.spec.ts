import { TestBed } from '@angular/core/testing';
import { Games } from './games.service';

describe('LastGamesAddedService', () => {
  let service: Games;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Games);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
