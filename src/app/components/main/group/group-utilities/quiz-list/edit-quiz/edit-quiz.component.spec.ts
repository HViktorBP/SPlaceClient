import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EditQuizComponent } from './edit-quiz.component';
import {ReactiveFormsModule, FormsModule, FormBuilder, Validators} from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { QuizzesService } from '../../../../../../services/quizzes.service';
import { UsersService } from '../../../../../../services/users.service';
import { GroupDataService } from '../../../../../../services/states/group-data.service';
import { ApplicationHubService } from '../../../../../../services/application-hub.service';
import { NgToastService } from 'ng-angular-popup';
import { of } from 'rxjs';

class MockQuizzesService {
  getQuiz(quizId: number) {
    return of({
      id: quizId,
      name: 'Sample Quiz',
      questions: [
        { id: 1, question: 'Sample Question 1', type: 0, answers: [{ answer: 'Answer 1', status: false }] },
      ],
    });
  }

  editQuiz() {
    return of({ message: 'Quiz updated successfully' });
  }

  buildQuiz(quizData: any) {
    return new FormBuilder().group({
      id: quizData.id,
      name: [quizData.name, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      questions: new FormBuilder().array([]),
    });
  }

  processQuizBeforeSubmit(questions: any) {
  }

  setValidatorsForQuestions(quizForm: any) {
  }

  setValidatorsForAnswers(questionForm: any) {
  }
}

class MockUsersService {
  getUserId() {
    return 1;
  }
}

class MockGroupDataService {
  currentGroupId = 1;
}

class MockApplicationHubService {
  editQuiz(groupId: number, quizId: number) {
    return Promise.resolve();
  }
}

class MockNgToastService {
  success(message: any) {
  }
}

describe('EditQuizComponent', () => {
  let component: EditQuizComponent;
  let fixture: ComponentFixture<EditQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatCheckboxModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: { quizId: 123 } },
        { provide: QuizzesService, useClass: MockQuizzesService },
        { provide: UsersService, useClass: MockUsersService },
        { provide: GroupDataService, useClass: MockGroupDataService },
        { provide: ApplicationHubService, useClass: MockApplicationHubService },
        { provide: NgToastService, useClass: MockNgToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with quiz data', fakeAsync(() => {
    component.ngOnInit();
    fixture.detectChanges();
    tick();

    expect(component.quizForm).toBeDefined();
    expect(component.quizForm.get('name')?.value).toBe('Sample Quiz');
    expect(component.questions.length).toBe(0); // Questions should be built using `buildQuiz`
  }));

  it('should add a question to the form', fakeAsync(() => {
    component.addQuestion();
    fixture.detectChanges();
    tick();

    expect(component.questions.length).toBe(1);
    const questionInputs = fixture.debugElement.queryAll(By.css('input[formControlName="question"]'));
    expect(questionInputs.length).toBe(1);
    expect(questionInputs[0].nativeElement.placeholder).toBe('Enter question');
  }));

  it('should add answers to a question', fakeAsync(() => {
    component.addQuestion();
    fixture.detectChanges();
    tick();

    component.addAnswer(0);
    fixture.detectChanges();
    tick();

    const answersArray = component.getAnswers(0);
    expect(answersArray.length).toBe(2);

    const answerInputs = fixture.debugElement.queryAll(By.css('input[formControlName="answer"]'));
    expect(answerInputs.length).toBe(2);
  }));

  it('should call editQuiz on submit', fakeAsync(() => {
    const quizzesService = TestBed.inject(QuizzesService);
    const applicationHub = TestBed.inject(ApplicationHubService);
    const toastService = TestBed.inject(NgToastService);

    spyOn(quizzesService, 'editQuiz').and.callThrough();
    spyOn(applicationHub, 'editQuiz').and.callThrough();
    spyOn(toastService, 'success').and.callThrough();

    component.quizForm.get('name')?.setValue('Edited Quiz Name');
    component.addQuestion()
    component.questions.at(0).get('question')?.setValue('Question 1')
    component.getAnswers(0).at(0)?.get('answer')?.setValue('Answer 1'); // Set answer to ensure it's not empty
    component.getAnswers(0).at(0)?.get('status')?.setValue('true');
    fixture.detectChanges();
    tick();

    component.onSubmit();
    fixture.detectChanges();
    tick();

    expect(quizzesService.editQuiz).toHaveBeenCalled();
    expect(applicationHub.editQuiz).toHaveBeenCalledWith(1, 123);
    expect(toastService.success).toHaveBeenCalledWith({
      detail: 'Success',
      summary: 'Quiz updated successfully',
      duration: 3000,
    });
    expect(component.dialogRef.close).toHaveBeenCalled();
  }));

  it('should close the dialog when "Cancel" button is clicked', () => {
    component.onCancel();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });
});
