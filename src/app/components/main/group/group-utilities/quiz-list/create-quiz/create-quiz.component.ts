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
import {QuizzesService} from "../../../../../../services/quizzes.service";
import {GroupDataService} from "../../../../../../services/states/group-data.service";
import {UsersService} from "../../../../../../services/users.service";
import {CreateQuizRequest} from "../../../../../../data-transferring/contracts/quiz/create-quiz-request";
import {catchError, finalize, switchMap, take, tap, throwError} from "rxjs";
import {NgToastService} from "ng-angular-popup";
import {ApplicationHubService} from "../../../../../../services/application-hub.service";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {UsersDataService} from "../../../../../../services/states/users-data.service";
import {CustomPopUpForm} from "../../../../../../custom/interfaces/CustomPopUpForm";
import {QuizValidators} from "../../../../../../custom/valiators/QuizValidators";
import {MatIcon} from "@angular/material/icon";


/**
 * CreateQuizComponent handles the logic and UI for creating a quiz.
 */

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
  /**
   * Description: Form for new quiz.
   */
  quizForm!: FormGroup

  /**
   * Description: Reference to the CreateQuizComponent that will be opened in MatDialog.
   */
  dialogRef = inject(MatDialogRef<CreateQuizComponent>)

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
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      questions: this.fb.array([this.newQuestion()],[QuizValidators.questionsValidator, QuizValidators.quizHasQuestionsValidator()])
    });
  }

  /**
   * Description: getter for questions in the form.
   * @memberOf CreateQuizComponent
   */
  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  /**
   * Description: creates new question in form.
   * @memberOf CreateQuizComponent
   */
  newQuestion(): FormGroup {
    return this.fb.group({
      question: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      type: [1, Validators.required],
      answers: this.fb.array([])
    }, { validators: [QuizValidators.trueFalseSingleCorrectValidator()] });
  }

  /**
   * Description: adds new question to the arrays of form's question.
   * @memberOf CreateQuizComponent
   */
  addQuestion() {
    this.questions.push(this.newQuestion());
  }

  /**
   * Description: removes question from the arrays of form's question.
   * @memberOf CreateQuizComponent
   */
  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  /**
   * Description: getter for answers in form's questions.
   * @param {number} index - question's index
   * @memberOf CreateQuizComponent
   */
  getAnswers(index: number): FormArray {
    return this.questions.at(index).get('answers') as FormArray;
  }

  /**
   * Description: creates new answer in form.
   * @memberOf CreateQuizComponent
   */
  newAnswer(): FormGroup {
    return this.fb.group({
      answer: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      status: [false]
    });
  }

  /**
   * Description: adds new answer to the arrays of answers that belong to specific question.
   * @memberOf CreateQuizComponent
   * @param {number} index - question's index
   */
  addAnswer(index: number) {
    this.getAnswers(index).push(this.newAnswer());
  }

  /**
   * Description: removes from the question.
   * @memberOf CreateQuizComponent
   * @param {number} questionIndex - question's index
   * @param {number} answerIndex - answer's index
   */
  removeAnswer(questionIndex: number, answerIndex: number) {
    this.getAnswers(questionIndex).removeAt(answerIndex);
  }

  /**
   * Description: closes the MatDialog and resets the form.
   * @memberOf CreateQuizComponent
   */
  closeDialog() {
    this.quizForm.reset()
    this.dialogRef.close();
  }

  /**
   * Description: onSubmit method calls a function that sends an HTTP request for creating a new quiz in the group and handles the UI according to the request's response.
   * If the operation successful, it updates the UI for all other users who participate in group by calling applicationHub's createNewQuiz method.
   * @see ApplicationHubService
   */
  onSubmit() {
    if (this.quizForm.valid) {
      const quizDto = this.quizForm.value

      this.quizForm.disable()

      const createQuizRequest : CreateQuizRequest = {
        userId: this.usersService.getUserId(),
        groupId: this.groupDataService.currentGroupId,
        quiz: quizDto
      }

      this.quizzesService.createNewQuiz(createQuizRequest)
        .pipe(
          take(1),
          switchMap(() =>
            this.usersService
              .getUserAccount(this.usersService.getUserId())
              .pipe(
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
          })
        )
        .subscribe({
          next : () => {
            this.applicationHubService
              .createQuiz(createQuizRequest.groupId)
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
