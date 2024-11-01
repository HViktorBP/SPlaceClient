import {Component, inject} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {MatDialogActions, MatDialogContainer, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {QuizzesService} from "../../../../../services/quizzes.service";
import {GroupDataService} from "../../../../../states/group-data.service";
import {UsersService} from "../../../../../services/users.service";
import {CreateQuizRequest} from "../../../../../data-transferring/contracts/quiz/create-quiz-request";
import {catchError, finalize, switchMap, take, tap, throwError} from "rxjs";
import {NgToastService} from "ng-angular-popup";
import {ApplicationHubService} from "../../../../../services/application-hub.service";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {UsersDataService} from "../../../../../states/users-data.service";
import {CustomPopUpForm} from "../../../../../custom/interfaces/CustomPopUpForm";
import {QuizValidators} from "../../../../../custom/valiators/QuizValidators";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButton,
    NgForOf,
    MatDialogTitle,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatCheckbox,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatDialogActions,
    MatDialogContainer,
    NgIf,
    MatError,
    MatIconButton,
    MatIcon
  ],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.scss'
})

export class CreateQuizComponent implements CustomPopUpForm {
  quizForm!: FormGroup
  dialogRef = inject(MatDialogRef<CreateQuizComponent>)
  isLoading!: boolean

  constructor(
    private fb: FormBuilder,
    private quizzesService : QuizzesService,
    private usersService : UsersService,
    private groupDataService : GroupDataService,
    private toast : NgToastService,
    private applicationHubService : ApplicationHubService,
    private userDataService : UsersDataService,
  ) {}

  ngOnInit() {
    this.quizForm = this.fb.group({
      name: ['', Validators.required],
      questions: this.fb.array([this.newQuestion()],[QuizValidators.questionsValidator, QuizValidators.quizHasQuestionsValidator()])
    });
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  newQuestion(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      type: [1, Validators.required],
      answers: this.fb.array([])
    }, { validators: [QuizValidators.trueFalseSingleCorrectValidator()] });
  }

  addQuestion() {
    this.questions.push(this.newQuestion());
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  getAnswers(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('answers') as FormArray;
  }

  newAnswer(): FormGroup {
    return this.fb.group({
      answer: ['', Validators.required],
      status: [false]
    });
  }

  addAnswer(questionIndex: number) {
    this.getAnswers(questionIndex).push(this.newAnswer());
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    this.getAnswers(questionIndex).removeAt(answerIndex);
  }

  closeDialog() {
    this.quizForm.reset()
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.quizForm.valid) {
      const quizDto = this.quizForm.value

      this.quizForm.disable()
      this.isLoading = true

      const createQuizRequest : CreateQuizRequest = {
        userId: this.usersService.getUserId(),
        groupId: this.groupDataService.currentGroupId,
        quiz: quizDto
      }

      this.quizzesService.createNewQuiz(createQuizRequest)
        .pipe(
          take(1),
          switchMap(() =>
            this.usersService.getUserAccount(this.usersService.getUserId()).pipe(
              take(1),
              tap(user => {
                this.userDataService.updateCreatedQuizzesData(user.createdQuizzes)
              })
            )
          ),
          catchError(error => {
            return throwError(() => error)
          }),
          finalize(() => {
            this.quizForm.enable()
            this.isLoading = false
          })
        )
        .subscribe({
          next : () => {
            this.applicationHubService.createQuiz(createQuizRequest.groupId)
              .then(() => {
                this.toast.success({detail: "Success", summary: "Quiz is created!", duration: 3000})
                this.dialogRef.close();
              })
          }
        })
    }
  }

  ngOnDestroy(): void {
    this.quizForm.reset()
  }
}
