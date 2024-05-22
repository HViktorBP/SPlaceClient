import { TestBed } from '@angular/core/testing';

import { QuizzesService } from './quizzes.service';
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

  it('should retrieve quizzes in group', () => {
    const mockQuizzes = [
      { name: 'Quiz 1', groupID: 1, creatorID: 1 },
      { name: 'Quiz 2', groupID: 1, creatorID: 1}
    ]

    service.getQuizzesInGroup(1).subscribe(quizzes => {
      expect(quizzes).toEqual(mockQuizzes)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}quizes-in-group?groupID=1`)
    expect(req.request.method).toBe('GET')
    req.flush(mockQuizzes)
  })

  it('should submit a new quiz', () => {
    const mockResponse = { message: 'Quiz added successfully' }
    const quizData = { name: 'New Quiz', questions: [] }

    service.submitNewQuiz(1, 1, 'admin', quizData).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}add-new-quiz?userID=1&groupID=1&role=admin`)
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual(quizData)
    req.flush(mockResponse)
  })

  it('should retrieve quiz ID', () => {
    const mockQuizId = 1

    service.getQuizId(1, 'Quiz 1').subscribe(id => {
      expect(id).toBe(mockQuizId)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}get-quiz-id?groupID=1&quizName=Quiz 1`)
    expect(req.request.method).toBe('GET')
    req.flush(mockQuizId)
  })

  it('should retrieve quiz', () => {
    const mockQuiz = { id: 1, name: 'Quiz 1', groupId: 1, questions: [] }

    service.getQuiz(1, 1).subscribe(quiz => {
      expect(quiz).toEqual(mockQuiz)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}get-quiz?groupID=1&quizId=1`)
    expect(req.request.method).toBe('GET')
    req.flush(mockQuiz)
  })

  it('should submit quiz result', () => {
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

  it('should delete quiz', () => {
    const mockResponse = { message: 'Quiz deleted successfully' }
    const quizBody = { name: 'Quiz 1', groupID: 1, creatorID : 1 }

    service.deleteQuiz(quizBody, 1, 'Creator').subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}delete-quiz-from-group?userID=1&role=Creator`)
    expect(req.request.method).toBe('DELETE')
    expect(req.request.body).toEqual(quizBody)
    req.flush(mockResponse)
  })
})
