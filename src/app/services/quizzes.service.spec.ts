import {TestBed} from '@angular/core/testing';

import {QuizzesService} from './quizzes.service';
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('QuizzesService', () => {
  let service: QuizzesService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents()
    service = TestBed.inject(QuizzesService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

describe('Http testing QuizzesService', () => {
  let service: QuizzesService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [QuizzesService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})

    service = TestBed.inject(QuizzesService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })
})
