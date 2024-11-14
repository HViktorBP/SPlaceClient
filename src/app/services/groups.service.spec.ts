import {TestBed} from '@angular/core/testing';

import {GroupsService} from './groups.service';
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GroupsService', () => {
  let service: GroupsService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
    imports: [],
    providers: [GroupsService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
