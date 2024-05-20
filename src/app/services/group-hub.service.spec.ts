import { TestBed } from '@angular/core/testing';

import { GroupHubService } from './group-hub.service';

describe('ChatService', () => {
  let service: GroupHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
