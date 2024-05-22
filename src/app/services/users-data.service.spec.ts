import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import { UsersDataService } from './users-data.service';

describe('UsersDataService', () => {
  let service: UsersDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule]
    }).compileComponents()
    service = TestBed.inject(UsersDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
