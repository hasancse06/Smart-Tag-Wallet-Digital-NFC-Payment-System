import { TestBed } from '@angular/core/testing';

import { CommonfunctionService } from './commonfunction.service';

describe('CommonfunctionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommonfunctionService = TestBed.get(CommonfunctionService);
    expect(service).toBeTruthy();
  });
});
