import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { QuizComponent } from './quiz.component';
import { QuizzesService } from "../../../../../services/quizzes.service";
import { NgToastService } from "ng-angular-popup";
import { UsersService } from "../../../../../services/users.service";
import { GroupDataService } from "../../../../../services/states/group-data.service";
import { ApplicationHubService } from "../../../../../services/application-hub.service";
import {ActivatedRoute, Router} from "@angular/router";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import {of, Subscription} from 'rxjs';

class MockQuizzesService {
  getQuizWithoutCorrectAnswers(quizId: number) {
    return of({
      name: 'Sample Quiz',
      questions: [
        {
          question: 'What is Angular?',
          type: 'SingleAnswer',
          answers: [{ answer: 'Framework' }, { answer: 'Library' }]
        }
      ]
    });
  }

  submitQuiz(request: any) {
    return of(request);
  }

  buildQuiz(quiz: any) {
    const fb = new FormBuilder();
    return fb.group({
      name: [quiz.name],
      questions: fb.array(quiz.questions.map((q: any) =>
        fb.group({
          question: [q.question],
          type: [q.type],
          selectedAnswer: [''],
          answers: fb.array(q.answers.map((a: any) =>
            fb.group({
              answer: [a.answer],
              status: [false]
            })
          ))
        })
      ))
    });
  }
}

class MockNgToastService {
  success(options: any) {}
}

class MockUsersService {
  getUserId() {
    return 1;
  }

  getUserAccount(userId: number) {
    return of({ scores: [] });
  }
}

class MockGroupDataService {
  currentGroupId = 1;
}

class MockApplicationHubService {
  submitQuiz(groupId: number) {
    return Promise.resolve();
  }
}

describe('QuizComponent', () => {
  let component: QuizComponent;
  let fixture: ComponentFixture<QuizComponent>;
  let mockQuizzesService: MockQuizzesService;
  let mockToastService: MockNgToastService;
  let mockUsersService: MockUsersService;
  let mockGroupDataService: MockGroupDataService;
  let mockApplicationHubService: MockApplicationHubService;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    mockQuizzesService = new MockQuizzesService();
    mockToastService = new MockNgToastService();
    mockUsersService = new MockUsersService();
    mockGroupDataService = new MockGroupDataService();
    mockApplicationHubService = new MockApplicationHubService();
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        QuizComponent,
        ReactiveFormsModule
      ],
      providers: [
        { provide: QuizzesService, useValue: mockQuizzesService },
        { provide: NgToastService, useValue: mockToastService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: GroupDataService, useValue: mockGroupDataService },
        { provide: ApplicationHubService, useValue: mockApplicationHubService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ quizId: 1 }),
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the quiz form with questions', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const quizName = component.quizForm.get('name')?.value;
      expect(quizName).toBe('Sample Quiz');
      expect(component.questions.length).toBe(1);
      expect(component.questions.at(0).get('question')?.value).toBe('What is Angular?');
    });
  }));

  it('should submit the quiz form successfully', waitForAsync(() => {
    spyOn(mockQuizzesService, 'submitQuiz').and.callThrough();
    spyOn(mockToastService, 'success').and.callThrough();
    component.quizForm.get('name')?.setValue('Sample Quiz');
    component.questions.push(
      new FormBuilder().group({
        question: ['What is Angular?'],
        type: ['SingleAnswer'],
        selectedAnswer: ['Framework'],
        answers: new FormBuilder().array([
          new FormBuilder().group({ answer: ['Framework'], status: [false] }),
          new FormBuilder().group({ answer: ['Library'], status: [false] })
        ])
      })
    );

    fixture.detectChanges();

    component.onSubmit();

    expect(mockQuizzesService.submitQuiz).toHaveBeenCalled();
  }));

  it('should call processQuizBeforeSubmit before submission', () => {
    spyOn(component, 'processQuizBeforeSubmit').and.callThrough();
    component.onSubmit();
    expect(component.processQuizBeforeSubmit).toHaveBeenCalled();
  });

  it('should unsubscribe from routerSubscription on destroy', () => {
    const routerSubscription = new Subscription();
    component['routerSubscription'] = routerSubscription;
    spyOn(routerSubscription, 'unsubscribe');

    component.ngOnDestroy();
    expect(routerSubscription.unsubscribe).toHaveBeenCalled();
  });
});
