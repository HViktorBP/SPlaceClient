import {TestBed} from '@angular/core/testing';

import {ApplicationHubService} from './application-hub.service';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('AppHubService', () => {
  let service: ApplicationHubService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule]
    }).compileComponents()
    service = TestBed.inject(ApplicationHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
