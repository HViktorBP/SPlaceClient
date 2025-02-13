import {Component, Inject, inject} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContainer,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton, MatIconButton} from "@angular/material/button";
import {NgForOf, NgIf} from "@angular/common";
import {QuizzesService} from "../../../../../../services/quizzes.service";
import {GroupDataService} from "../../../../../../services/states/group-data.service";
import {UsersService} from "../../../../../../services/users.service";
import {catchError, finalize, switchMap, take, tap, throwError} from "rxjs";
import {NgToastService} from "ng-angular-popup";
import {ApplicationHubService} from "../../../../../../services/application-hub.service";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {UserDataService} from "../../../../../../services/states/user-data.service";
import {CustomPopUpForm} from "../../../../../../custom/interfaces/CustomPopUpForm";
import {MatIcon} from "@angular/material/icon";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {QuizForm} from "../../../../../../custom/classes/QuizForm";
import {SubmitQuizRequest} from "../../../../../../data-transferring/contracts/quiz/submit-quiz-request";
import {trimFormValues} from "../../../../../../custom/helping-functions/FormTrim";

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
    MatIcon,
    MatRadioButton,
    MatRadioGroup
  ],
  templateUrl: './create-quiz.component.html',
  styleUrl: './../../../../../../custom/styles/quiz.scss'
})

export class CreateQuizComponent extends QuizForm implements CustomPopUpForm {
  /**
   * Description: Reference to the component that will be opened in dialog
   */
  public dialogRef = inject(MatDialogRef<CreateQuizComponent>)

  constructor(
    protected override fb : FormBuilder,
    protected override quizzesService : QuizzesService,
    private usersService: UsersService,
    private usersDataService: UserDataService,
    private groupDataService: GroupDataService,
    private applicationHub: ApplicationHubService,
    private toast: NgToastService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(quizzesService, fb)
  }

  ngOnInit() {
    this.quizForm = this.fb.group({
      id: 0,
      groupId: 0,
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      questions : this.fb.array([this.createQuestion()])
      }
    )

    this.quizzesService.setValidatorsForQuestions(this.quizForm)
  }

  /**
   * Description: onSubmit method preprocesses quiz before submitting it and then calls a function that sends an HTTP request for editing a quiz in the group and handles the UI according to the request's response.
   * If the operation successful, it updates the UI for all other users who participate in group by calling applicationHub's editQuiz method.
   * @see ApplicationHubService
   */
  onSubmit() {
    if (this.quizForm.valid) {
      trimFormValues(this.quizForm)

      this.quizzesService.processQuizBeforeSubmit(this.questions)

      const quizData = this.quizForm.value

      const creatQuizRequest: SubmitQuizRequest = {
        userId: this.usersService.getUserId(),
        groupId: this.groupDataService.currentGroupId,
        quiz: quizData
      }

      this.quizForm.disable()

      this.quizzesService.createNewQuiz(creatQuizRequest)
        .pipe(
          switchMap(() => {
            return this.usersService.getUserAccount(this.usersService.getUserId())
          }),
          tap(account => {
            this.usersDataService.updateCreatedQuizzesData(account.createdQuizzes)
          }),
          catchError(error => {
            return throwError(() => error)
          }),
          finalize(() => {
            this.quizForm.enable()
          })
        )
        .subscribe({
          next: () => {
            this.applicationHub
              .createQuiz(this.groupDataService.currentGroupId)
              .then(() => {
                this.toast.success({detail: 'Success', summary: 'Quiz created successfully!', duration: 3000})
                this.dialogRef.close()
              })
          }
        })
    }
  }

  /**
   * Description: cancels the quiz editing
   */
  override onCancel(): void {
    super.onCancel()
    this.dialogRef.close()
  }
}
