import { TestBed } from '@angular/core/testing';

import { AppHubService } from './app-hub.service';

describe('AppHubService', () => {
  let service: AppHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
