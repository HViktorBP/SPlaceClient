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

  it('should retrieve quiz-list ID', () => {
    const mockQuizId = 1

    service.getQuizId(1, 'Quiz 1').subscribe(id => {
      expect(id).toBe(mockQuizId)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}get-quiz-id?groupID=1&quizName=Quiz 1`)
    expect(req.request.method).toBe('GET')
    req.flush(mockQuizId)
  })


  it('should submit quiz-list result', () => {
    const mockResponse = { message: 'Quiz result submitted successfully' }
    const quizResult = { answers: [] }

    service.submitQuizResult(1, 1, 1, quizResult).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}submit-quiz-result?userID=1&groupID=1&quizID=1`)
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual(quizResult)
    req.flush(mockResponse)
  })
})
