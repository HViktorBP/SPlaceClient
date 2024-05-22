import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import { GroupHubService } from './group-hub.service';

describe('ChatService', () => {
  let service: GroupHubService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }).compileComponents()
    service = TestBed.inject(GroupHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
