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
import {catchError, take, throwError} from "rxjs";
import {NgToastService} from "ng-angular-popup";
import {MatOption, MatSelect} from "@angular/material/select";
import {UsersService} from "../../../../../../services/users.service";
import {GroupDataService} from "../../../../../../services/states/group-data.service";
import {SubmitQuizRequest} from "../../../../../../data-transferring/contracts/quiz/submit-quiz-request";
import {ApplicationHubService} from "../../../../../../services/application-hub.service";
import {CustomPopUpForm} from "../../../../../../custom/interfaces/CustomPopUpForm";
import {Router} from "@angular/router";
import {QuizValidators} from "../../../../../../custom/valiators/QuizValidators";

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
  styleUrl: './edit-quiz.component.scss'
})

export class EditQuizComponent implements CustomPopUpForm {
  /**
   * Description: quiz's form
   */
  quizForm!: FormGroup

  /**
   * Description: indicates whether quiz fetching is still going on or not
   */
  isLoading!: boolean


  public dialogRef = inject(MatDialogRef<EditQuizComponent>)

  constructor(
    private fb: FormBuilder,
    private quizzesService: QuizzesService,
    private usersService: UsersService,
    private groupDataService: GroupDataService,
    private applicationHub: ApplicationHubService,
    private toast: NgToastService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.initializeForm();
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
          this.setValidatorsForQuestions()
          this.quizForm.get('name')?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(30)])
        }
      })
  }

  /**
   * Description: getter for questions in form.
   */
  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray
  }

  /**
   * Description: creates a new question in form.
   */
  createQuestion(): FormGroup {
    return this.fb.group({
      id: 0,
      question: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      type: [0, Validators.required],
      selectedAnswer: '',
      answers: this.fb.array([])
    })
  }

  /**
   * Description: creates a new answer in form.
   */
  createAnswer(): FormGroup {
    return this.fb.group({
      id: 0,
      answer: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      status: [false]
    });
  }

  /**
   * Description: adds a new question to array of questions and sets validators on it.
   */
  addQuestion() {
    this.questions.push(this.createQuestion());
    this.setValidatorsForQuestions();
  }

  /**
   * Description: adds a new answers to array of answers and sets validators on it.
   * @param {number} index - question's index
   */
  addAnswer(index: number) {
    this.getAnswers(index).push(this.createAnswer());
    this.setValidatorsForAnswers(this.questions.at(index) as FormGroup);
  }

  /**
   * Description: removes a question for from and resets the validators.
   * @param index
   */
  removeQuestion(index: number) {
    this.questions.removeAt(index);
    this.setValidatorsForQuestions();
  }

  /**
   * Description: removes an answer for from and resets the validators.
   * @param {number} questionIndex - question's index
   * @param {number} answerIndex - answer's index
   */
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

  /**
   * Description: getter for answers.
   * @param {number} index - question's index
   */
  getAnswers(index: number): FormArray {
    return this.questions.at(index).get('answers') as FormArray;
  }

  /**
   * Description: adds a control named singleAnswer for the question of type SingleAnswer.
   * @param {number} index - question's index
   */
  addSingleAnswer(index: number) {
    const questionFormGroup = this.questions.at(index) as FormGroup;
    questionFormGroup.addControl('selectedAnswer', new FormControl(''));
  }

  /**
   * Description: remove control named singleAnswer from question.
   * @param {number} index - question's index
   */
  removeSingleAnswer(index: number) {
    const questionFormGroup = this.questions.at(index) as FormGroup;
    if (questionFormGroup.contains('selectedAnswer')) {
      questionFormGroup.removeControl('selectedAnswer');
    }
  }

  /**
   * Description: onSubmit method preprocesses quiz before submitting it and then calls a function that sends an HTTP request for editing a quiz in the group and handles the UI according to the request's response.
   * If the operation successful, it updates the UI for all other users who participate in group by calling applicationHub's editQuiz method.
   * @see ApplicationHubService
   */
  onSubmit() {
    if (this.quizForm.valid) {
      this.dialogRef.close(true)
      const quizData = this.quizForm.value;

      this.processQuizBeforeSubmit(quizData)

      const editQuizRequest: SubmitQuizRequest = {
        userId: this.usersService.getUserId(),
        groupId: this.groupDataService.currentGroupId,
        quiz: quizData
      };

      this.quizzesService.editQuiz(editQuizRequest)
        .pipe(
          take(1),
          catchError(error => {
            return throwError(() => error)
          })
        )
        .subscribe({
          next: (res) => {
            this.applicationHub
              .editQuiz(editQuizRequest.groupId, editQuizRequest.quiz.id)
              .then(() => {
                this.router
                  .navigate(['/main/group', this.groupDataService.currentGroupId])
                  .then(() => this.toast.success({ detail: 'Success', summary: res.message, duration: 3000 }))
              })
          }
        })
    }
  }

  /**
   * Description: cancels the quiz editing
   */
  onCancel(): void {
    this.quizForm.reset()
    this.dialogRef.close()
  }

  ngOnDestroy() {
    this.quizForm.reset();
  }

  /**
   * Description: processes quiz data by deleting all the unnecessary controls from it.
   * @param quiz - The value of the quiz's form
   * @private
   */
  private processQuizBeforeSubmit(quiz: any) {
    quiz.questions.forEach((question: any, index: number) => {
      if (question.type === 0 && question.selectedAnswer) {
        question.answers.forEach((answer: any) => {
          answer.status = answer.answer === question.selectedAnswer
        })

        const questionFormGroup = this.questions.at(index) as FormGroup;
        questionFormGroup.removeControl('selectedAnswer')
      }
    })
  }

  /**
   * Description: sets validators for the questions
   * @private
   */
  private setValidatorsForQuestions() {
    const questionsArray = this.quizForm.get('questions') as FormArray;
    questionsArray.setValidators([
      QuizValidators.questionsValidator(),
      QuizValidators.quizHasQuestionsValidator()
    ])
    questionsArray.updateValueAndValidity()

    questionsArray.controls.forEach((questionControl) => {
      questionControl.get('question')?.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(500)]);
    })

    questionsArray.controls.forEach((questionControl) => {
      this.setValidatorsForAnswers(questionControl);
    })
  }

  /**
   * Description: sets validators for the answers
   * @private
   */
  private setValidatorsForAnswers(questionControl: any) {
    const answersArray = questionControl.get('answers') as FormArray;
    answersArray.setValidators(QuizValidators.trueFalseSingleCorrectValidator())
    answersArray.controls.forEach((answersControl) => {
      answersControl.get('answer')?.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(500)]);
    })
    answersArray.updateValueAndValidity()
  }

  /**
   * Description: set's the status of selected answer to true and others to false when user sets a correct answer on question with thy type SingleAnswer
   * @param questionIndex - question's index
   * @param answerIndex - answer's index
   */
  onSingleAnswerSelection(questionIndex: number, answerIndex: number) {
    const questionFormGroup = this.questions.at(questionIndex) as FormGroup
    const answersArray = questionFormGroup.get('answers') as FormArray

    answersArray.controls.forEach((control, index) => {
      if (index !== answerIndex) {
        control.get('status')?.setValue(false);
      }
    })

    answersArray.at(answerIndex).get('status')?.setValue(true)
    questionFormGroup.get('selectedAnswer')?.setValue(answersArray.at(answerIndex).get('answer')!.value)
  }
}
