import { TestBed } from '@angular/core/testing';

import { AppHubService } from './app-hub.service';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('AppHubService', () => {
  let service: AppHubService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule]
    }).compileComponents()
    service = TestBed.inject(AppHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
