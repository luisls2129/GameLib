import { TestBed } from '@angular/core/testing';

import { ComunicacionMenuService } from './comunicacion-menu.service';

describe('ComunicacionMenuService', () => {
  let service: ComunicacionMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComunicacionMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
