import {Component, inject, Inject} from '@angular/core';
import {
  FormArray,
  FormBuilder,
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
import {catchError, finalize, take, throwError} from "rxjs";
import {NgToastService} from "ng-angular-popup";
import {MatOption, MatSelect} from "@angular/material/select";
import {UsersService} from "../../../../../../services/users.service";
import {GroupDataService} from "../../../../../../services/states/group-data.service";
import {SubmitQuizRequest} from "../../../../../../data-transferring/contracts/quiz/submit-quiz-request";
import {ApplicationHubService} from "../../../../../../services/application-hub.service";
import {CustomPopUpForm} from "../../../../../../custom/interfaces/CustomPopUpForm";
import {QuizForm} from "../../../../../../custom/classes/QuizForm";
import {trimFormValues} from "../../../../../../custom/helping-functions/FormTrim";

/**
 * EditQuizComponent provides a UI for editing the quiz.
 */

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
  styleUrl: './../../../../../../custom/styles/quiz.scss'
})

export class EditQuizComponent extends QuizForm implements CustomPopUpForm {
  /**
   * Description: Reference to the component that will be opened in dialog
   */
  public dialogRef = inject(MatDialogRef<EditQuizComponent>)

  /**
   * Description: Indicates whether the quiz was fetched or not
   */
  isLoading!: boolean

  constructor(
    protected override fb: FormBuilder,
    protected override quizzesService: QuizzesService,
    private usersService: UsersService,
    private groupDataService: GroupDataService,
    private applicationHub: ApplicationHubService,
    private toast: NgToastService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(quizzesService, fb)
  }

  ngOnInit() {
    this.isLoading = true
    this.initializeForm()
  }

  /**
   * Description: fetches the quiz
   * @private
   * @memberOf EditQuizComponent
   */
  private initializeForm() {
    this.quizzesService
      .getQuiz(this.data.quizId)
      .pipe(
        take(1),
        catchError(error => {
          return throwError(() => error)
        })
      )
      .subscribe({
        next: (quiz) => {
          this.quizForm = this.quizzesService.buildQuiz(quiz)
          this.isLoading = false
          this.quizzesService.setValidatorsForQuestions(this.quizForm)
          this.quizForm.get('name')?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(30)]);
          ((this.quizForm.get('questions') as FormArray).controls.forEach((question) => {
              (question.get('answers') as FormArray).controls.forEach((answer) => {
                  answer.get('status')?.enable()
                  const dynamicSubscription = answer.get('answer')?.valueChanges.subscribe((answerValue) => {
                    console.log('here')
                    if (answerValue || answerValue === '') {
                      answer.get('status')?.enable()
                      console.log('enabled')
                    } else {
                      answer.get('status')?.disable()
                      console.log('disabled')
                    }
                  })

                  this.dynamicControlSubscriptions.push(dynamicSubscription!)
              })
          }))
        }
      })
  }

  /**
   * Description: onSubmit method preprocesses quiz before submitting it and then calls a function that sends an HTTP request for editing a quiz in the group and handles the UI according to the request's response.
   * If the operation successful, it updates the UI for all other users who participate in group by calling applicationHub's editQuiz method.
   * @see ApplicationHubService
   */
  onSubmit() {
    if (this.quizForm.valid) {
      trimFormValues(this.quizForm)

      const quizData = this.quizForm.value

      this.quizForm.disable()

      this.quizzesService.processQuizBeforeSubmit(this.questions)

      const editQuizRequest: SubmitQuizRequest = {
        userId: this.usersService.getUserId(),
        groupId: this.groupDataService.currentGroupId,
        quiz: quizData
      }

      this.quizzesService.editQuiz(editQuizRequest)
        .pipe(
          take(1),
          catchError(error => {
            return throwError(() => error)
          }),
          finalize(() => {
            this.quizForm.enable()
          })
        )
        .subscribe({
          next: (res) => {
            this.applicationHub
              .editQuiz(editQuizRequest.groupId, editQuizRequest.quiz.id)
              .then(() => {
                this.toast.success({ detail: 'Success', summary: res.message, duration: 3000 })
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
