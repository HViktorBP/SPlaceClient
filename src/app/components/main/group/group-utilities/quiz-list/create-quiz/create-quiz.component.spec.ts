import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CreateQuizComponent } from './create-quiz.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // Add `MAT_DIALOG_DATA` import
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import {QuizzesService} from "../../../../../../services/quizzes.service";
import {UsersService} from "../../../../../../services/users.service"; // Add HttpClientModule import to provide HttpClient

class MockQuizzesService {
  setValidatorsForQuestions(form: any) {
  }
  setValidatorsForAnswers(form: any) {
  }
}

class MockUsersService {
  getUserId() {
    return 1;
  }
}

describe('CreateQuizComponent', () => {
  let component: CreateQuizComponent;
  let fixture: ComponentFixture<CreateQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateQuizComponent,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        HttpClientModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: QuizzesService, useClass: MockQuizzesService },
        { provide: UsersService, useClass: MockUsersService },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.quizForm).toBeDefined();
    expect(component.questions.length).toBe(1);
  });

  it('should add a question to the form', fakeAsync(() => {
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
    expect(answerInputs.length).toBe(3);
    expect(answerInputs[0].nativeElement.placeholder).toBe('Enter answer');
  }));

  it('should show validation errors for quiz name', () => {
    const quizNameInput = component.quizForm.get('name');
    quizNameInput?.setValue('');
    quizNameInput?.markAsTouched();
    fixture.detectChanges();

    expect(quizNameInput?.errors).not.toBeNull();
  });

  it('should disable "Save Quiz" button when form is invalid', fakeAsync(() => {
    const saveButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(saveButton.nativeElement.disabled).toBeTruthy();

    component.quizForm.get('name')?.setValue('Sample Quiz');
    component.questions.at(0).get('question')?.setValue('Question 1')
    component.getAnswers(0).at(0)?.get('answer')?.setValue('Answer 1');
    component.getAnswers(0).at(0)?.get('status')?.setValue('true');
    fixture.detectChanges();
    tick();

    expect(saveButton.nativeElement.disabled).toBeFalsy();
  }));
});
