import {TestBed} from '@angular/core/testing';

import {UsersService} from './users.service';
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('UserService', () => {
  let service: UsersService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
    imports: [],
    providers: [UsersService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})

    service = TestBed.inject(UsersService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })
})

