import {Component, inject, Inject} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {NgForOf, NgIf} from "@angular/common";
import {MatHint, MatInput} from "@angular/material/input";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogRef} from "@angular/material/dialog";
import {QuizzesService} from "../../../../../../services/quizzes.service";
import {take} from "rxjs";
import {NgToastService} from "ng-angular-popup";
import {MatOption, MatSelect} from "@angular/material/select";
import {UsersService} from "../../../../../../services/users.service";
import {GroupDataService} from "../../../../../../services/states/group-data.service";
import {SubmitQuizRequest} from "../../../../../../data-transferring/contracts/quiz/submit-quiz-request";
import {ApplicationHubService} from "../../../../../../services/application-hub.service";
import {CustomPopUpForm} from "../../../../../../custom/interfaces/CustomPopUpForm";
import {Router} from "@angular/router";
import {QuizValidators} from "../../../../../../custom/valiators/QuizValidators";

@Component({
  selector: 'app-edit-quiz',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatRadioGroup,
    MatRadioButton,
    NgForOf,
    MatInput,
    MatCheckbox,
    MatIconButton,
    MatLabel,
    MatIcon,
    MatButton,
    NgIf,
    MatSelect,
    MatOption,
    MatError,
    MatHint,
    MatDialogActions
  ],
  templateUrl: './edit-quiz.component.html',
  styleUrl: './edit-quiz.component.scss'
})
export class EditQuizComponent implements CustomPopUpForm {
  quizForm!: FormGroup;
  isLoading!: boolean;
  public dialogRef = inject(MatDialogRef<EditQuizComponent>);

  constructor(
    private fb: FormBuilder,
    private quizzesService: QuizzesService,
    private usersService: UsersService,
    private groupDataService: GroupDataService,
    private applicationHub: ApplicationHubService,
    private toast: NgToastService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.initializeForm();
  }

  private initializeForm() {
    this.quizzesService.getQuiz(this.data.quizId)
      .pipe(take(1))
      .subscribe({
        next: (quiz) => {
          this.quizForm = this.quizzesService.buildQuiz(quiz);
          this.isLoading = false;
          this.setValidatorsForQuestions();
        }
      });
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  createQuestion(): FormGroup {
    return this.fb.group({
      id: 0,
      question: ['', Validators.required],
      type: [0, Validators.required],
      selectedAnswer: '',
      answers: this.fb.array([])
    });
  }

  createAnswer(): FormGroup {
    return this.fb.group({
      id: 0,
      answer: ['', Validators.required],
      status: [false]
    });
  }

  addQuestion() {
    this.questions.push(this.createQuestion());
    this.setValidatorsForQuestions();
  }

  addAnswer(questionIndex: number) {
    this.getAnswers(questionIndex).push(this.createAnswer());
    this.setValidatorsForAnswers(this.questions.at(questionIndex) as FormGroup);
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
    this.setValidatorsForQuestions();
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    const questionFormGroup = this.questions.at(questionIndex) as FormGroup;
    const selectedAnswer = questionFormGroup.get('selectedAnswer')?.value;
    const answersArray = this.getAnswers(questionIndex);
    const removedAnswer = answersArray.at(answerIndex).get('answer')?.value;

    answersArray.removeAt(answerIndex);

    if (questionFormGroup.get('type')?.value === 0 && removedAnswer === selectedAnswer) {
      questionFormGroup.get('selectedAnswer')?.setValue('');
    }

    this.setValidatorsForAnswers(questionFormGroup);
  }

  getAnswers(i: number): FormArray {
    return this.questions.at(i).get('answers') as FormArray;
  }

  addSingleAnswer(index: number) {
    const questionFormGroup = this.questions.at(index) as FormGroup;
    questionFormGroup.addControl('selectedAnswer', new FormControl(''));
  }

  removeSingleAnswer(index: number) {
    const questionFormGroup = this.questions.at(index) as FormGroup;
    if (questionFormGroup.contains('selectedAnswer')) {
      questionFormGroup.removeControl('selectedAnswer');
    }
  }

  onSubmit() {
    if (this.quizForm.valid) {
      this.dialogRef.close(true);
      const quizData = this.quizForm.value;

      this.processQuizBeforeSubmit(quizData);

      const editQuizRequest: SubmitQuizRequest = {
        userId: this.usersService.getUserId(),
        groupId: this.groupDataService.currentGroupId,
        quiz: quizData
      };

      this.quizzesService.editQuiz(editQuizRequest)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.applicationHub.editQuiz(editQuizRequest.groupId, editQuizRequest.quiz.id)
              .then(() => {
                this.router.navigate(['/main/group', this.groupDataService.currentGroupId])
                  .then(() => this.toast.success({ detail: 'Success', summary: res.message, duration: 3000 }));
              });
          }
        });

      console.log(quizData);
    }
  }

  onCancel(): void {
    this.quizForm.reset();
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.quizForm.reset();
  }

  private processQuizBeforeSubmit(quiz: any) {
    quiz.questions.forEach((question: any, index: number) => {
      if (question.type === 0 && question.selectedAnswer) {
        question.answers.forEach((answer: any) => {
          console.log(answer.answer);
          console.log(question.selectedAnswer);
          answer.status = answer.answer === question.selectedAnswer;
        });

        const questionFormGroup = this.questions.at(index) as FormGroup;
        questionFormGroup.removeControl('selectedAnswer');
      }
    });
  }


  private setValidatorsForQuestions() {
    const questionsArray = this.quizForm.get('questions') as FormArray;
    questionsArray.setValidators([
      QuizValidators.questionsValidator,
      QuizValidators.quizHasQuestionsValidator()
    ]);
    questionsArray.updateValueAndValidity();

    questionsArray.controls.forEach((questionControl) => {
      this.setValidatorsForAnswers(questionControl);
    });
  }

  private setValidatorsForAnswers(questionControl: any) {
    const answersArray = questionControl.get('answers') as FormArray;
    answersArray.setValidators(QuizValidators.trueFalseSingleCorrectValidator());
    answersArray.updateValueAndValidity();
  }

  onSingleAnswerSelection(questionIndex: number, answerIndex: number) {
    const questionFormGroup = this.questions.at(questionIndex) as FormGroup;
    const answersArray = questionFormGroup.get('answers') as FormArray;

    answersArray.controls.forEach((control, index) => {
      if (index !== answerIndex) {
        control.get('status')?.setValue(false);
      }
    });

    answersArray.at(answerIndex).get('status')?.setValue(true);
    questionFormGroup.get('selectedAnswer')?.setValue(answersArray.at(answerIndex).get('answer')!.value);
  }
}
