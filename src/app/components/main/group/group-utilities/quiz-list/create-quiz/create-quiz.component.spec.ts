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

// Mock QuizzesService
class MockQuizzesService {
  setValidatorsForQuestions(form: any) {
    // Mock implementation
  }
  setValidatorsForAnswers(form: any) {
    // Mock implementation
  }
}

// Mock UsersService
class MockUsersService {
  getUserId() {
    return 1; // Mock return value
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
        NoopAnimationsModule, // To disable animations during testing
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
        HttpClientModule, // Provide HttpClient for dependent services
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: QuizzesService, useClass: MockQuizzesService }, // Provide mock `QuizzesService`
        { provide: UsersService, useClass: MockUsersService }, // Provide mock `UsersService`
        { provide: MAT_DIALOG_DATA, useValue: {} }, // Provide empty data for `MAT_DIALOG_DATA`
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
    expect(component.questions.length).toBe(1); // Initially, no questions should be present
  });

  it('should add a question to the form', fakeAsync(() => {
    fixture.detectChanges();
    tick(); // Simulate the passage of time

    // Verify that a question has been added to the form array
    expect(component.questions.length).toBe(1);

    // Check if the question appears in the DOM
    const questionInputs = fixture.debugElement.queryAll(By.css('input[formControlName="question"]'));
    expect(questionInputs.length).toBe(1);
    expect(questionInputs[0].nativeElement.placeholder).toBe('Enter question');
  }));

  it('should add answers to a question', fakeAsync(() => {
    // Add a question first
    component.addQuestion();
    fixture.detectChanges();
    tick();

    // Now add answers to that question
    component.addAnswer(0); // Add second answer to question at index 0
    fixture.detectChanges();
    tick();

    // Verify that two answers have been added to the first question
    const answersArray = component.getAnswers(0);
    expect(answersArray.length).toBe(2);

    // Check if the answers appear in the DOM
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
    expect(saveButton.nativeElement.disabled).toBeTruthy(); // Should be disabled initially

    // Make the form valid by adding quiz name and a question
    component.quizForm.get('name')?.setValue('Sample Quiz');
    component.questions.at(0).get('question')?.setValue('Question 1')
    component.getAnswers(0).at(0)?.get('answer')?.setValue('Answer 1'); // Set answer to ensure it's not empty
    component.getAnswers(0).at(0)?.get('status')?.setValue('true');
    fixture.detectChanges();
    tick();

    expect(saveButton.nativeElement.disabled).toBeFalsy(); // Should now be enabled
  }));
});
