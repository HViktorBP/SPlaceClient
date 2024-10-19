import {TestBed} from '@angular/core/testing';

import {QuizzesService} from './quizzes.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('QuizzesService', () => {
  let service: QuizzesService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
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
      imports: [HttpClientTestingModule],
      providers: [QuizzesService]
    })

    service = TestBed.inject(QuizzesService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })
})
