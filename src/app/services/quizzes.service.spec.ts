import { TestBed } from '@angular/core/testing';
import { QuizzesService } from './quizzes.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { SubmitQuizRequest } from '../data-transferring/contracts/quiz/submit-quiz-request';
import { DeleteQuizRequest } from '../data-transferring/contracts/quiz/delete-quiz-request';
import { QuizDto } from '../data-transferring/dtos/quiz/quiz-dto';
import { FormBuilder, FormGroup } from '@angular/forms';

describe('QuizzesService', () => {
  let service: QuizzesService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl + 'Quizzes/';
  let formBuilder: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [QuizzesService, FormBuilder]
    });
    service = TestBed.inject(QuizzesService);
    httpMock = TestBed.inject(HttpTestingController);
    formBuilder = TestBed.inject(FormBuilder);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get quiz data', () => {
    const mockQuizId = 1;
    const mockResponse: QuizDto = {
      id: mockQuizId,
      groupId: 1,
      name: 'Sample Quiz',
      questions: []
    };

    service.getQuiz(mockQuizId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}${mockQuizId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get quiz data without correct answers', () => {
    const mockQuizId = 1;
    const mockResponse: QuizDto = {
      id: mockQuizId,
      groupId: 1,
      name: 'Sample Quiz',
      questions: []
    };

    service.getQuizWithoutCorrectAnswers(mockQuizId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}${mockQuizId}/unanswered`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a new quiz', () => {
    const mockRequest: SubmitQuizRequest = {
      userId: 1,
      groupId: 1,
      quiz: {
        id: 1,
        groupId: 1,
        name: 'New Quiz',
        questions: []
      }
    };
    const mockResponse = { message: 'Quiz created successfully' };

    service.createNewQuiz(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}create`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should submit a quiz', () => {
    const mockRequest: SubmitQuizRequest = {
      userId: 1,
      groupId: 1,
      quiz: {
        id: 1,
        groupId: 1,
        name: 'Submit Quiz',
        questions: []
      }
    };
    const mockResponse = 'Quiz submitted successfully';

    service.submitQuiz(mockRequest).subscribe(response => {
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}submit`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should delete a quiz', () => {
    const mockRequest: DeleteQuizRequest = {
      userId: 1,
      groupId: 1,
      quizId: 1
    };
    const mockResponse = { message: 'Quiz deleted successfully' };

    service.deleteQuiz(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}quiz`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  it('should edit a quiz', () => {
    const mockRequest: SubmitQuizRequest = {
      userId: 1,
      groupId: 1,
      quiz: {
        id: 1,
        groupId: 1,
        name: 'Edited Quiz',
        questions: []
      }
    };
    const mockResponse = { message: 'Quiz edited successfully' };

    service.editQuiz(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}edit`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should build a quiz form', () => {
    const mockQuiz: QuizDto = {
      id: 1,
      groupId: 1,
      name: 'Mock Quiz',
      questions: []
    };

    const formGroup = service.buildQuiz(mockQuiz);
    expect(formGroup).toBeTrue();
    expect(formGroup.get('id')?.value).toBe(mockQuiz.id);
    expect(formGroup.get('groupId')?.value).toBe(mockQuiz.groupId);
    expect(formGroup.get('name')?.value).toBe(mockQuiz.name);
  });

  it('should process quiz before submit', () => {
    const formArray = formBuilder.array([formBuilder.group({
      type: 0,
      selectedAnswer: 1,
      answers: formBuilder.array([formBuilder.group({ status: false }), formBuilder.group({ status: true })])
    })]);

    service.processQuizBeforeSubmit(formArray);

    const question = formArray.at(0) as FormGroup;
    formArray.updateValueAndValidity();

    expect(question.get('answers')?.value[1].status).toBeTrue();

    const selectedAnswerControl = question.get('selectedAnswer');
    expect(selectedAnswerControl?.value).toBeUndefined();
  });
});
