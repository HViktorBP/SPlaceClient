import {TestBed} from '@angular/core/testing';

import {GroupsService} from './groups.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('GroupsService', () => {
  let service: GroupsService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }).compileComponents()
    service = TestBed.inject(GroupsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

describe('Http testing GroupsService', () => {
  let service: GroupsService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GroupsService]
    })

    service = TestBed.inject(GroupsService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify() // Verify that no unmatched requests are outstanding
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })


})
