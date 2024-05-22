import { TestBed } from '@angular/core/testing';

import { GroupsService } from './groups.service';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('GroupsService', () => {
  let service: GroupsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule]
    }).compileComponents()
    service = TestBed.inject(GroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
