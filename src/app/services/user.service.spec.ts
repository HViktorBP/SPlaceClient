import {TestBed} from '@angular/core/testing';

import {UsersService} from './users.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('UserService', () => {
  let service: UsersService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }).compileComponents()
    service = TestBed.inject(UsersService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

describe('Http testing UsersService', () => {
  let service: UsersService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService]
    })

    service = TestBed.inject(UsersService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })
})

