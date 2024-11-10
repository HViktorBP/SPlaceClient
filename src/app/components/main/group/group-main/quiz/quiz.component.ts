import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {QuizzesService} from "../../../../../services/quizzes.service";
import {NgToastService} from "ng-angular-popup";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {catchError, Subscription, switchMap, take, tap, throwError} from "rxjs";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SubmitQuizRequest} from "../../../../../data-transferring/contracts/quiz/submit-quiz-request";
import {UsersService} from "../../../../../services/users.service";
import {GroupDataService} from "../../../../../services/states/group-data.service";
import {Question} from "../../../../../data-transferring/enums/question";
import {ApplicationHubService} from "../../../../../services/application-hub.service";
import {UsersDataService} from "../../../../../services/states/users-data.service";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatButton} from "@angular/material/button";

/**
 * QuizComponent responsible for quiz's UI.
 */
@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    JsonPipe,
    MatProgressSpinner,
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    MatRadioGroup,
    MatRadioButton,
    MatCheckbox,
    MatButton,
    RouterLink,
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})

export class QuizComponent implements OnInit, OnDestroy {
  /**
   * Description: router subscription
   * @private
   */
  private routerSubscription!: Subscription

  /**
   * Description: Quiz form
   */
  quizForm!: FormGroup

  /**
   * Description: Loading indicator
   */
  isLoading!: boolean

  /**
   * Description: Question enum
   * @protected
   */
  protected readonly Question = Question

  constructor(
    private quizzesService: QuizzesService,
    private toast: NgToastService,
    private usersService: UsersService,
    public groupDataService: GroupDataService,
    private applicationHubService: ApplicationHubService,
    private userDataService : UsersDataService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.quizForm = this.fb.group({
      name: ['', Validators.required],
      questions: this.fb.array([])
    })

    this.isLoading = true
    this.loadQuiz()
  }

  /**
   * Description: Getter for questions in form.
   */
  get questions() {
    return this.quizForm.get('questions') as FormArray
  }

  /**
   * Description: Getter for answers in form.
   * @param {number} i - question index.
   */
  getAnswers(i: number) {
    return this.questions.at(i).get('answers') as FormArray
  }

  /**
   * Description: onSubmit method calls the HTTP request for submitting the quiz for checking its score and handles the UI according to the request's status.
   * @memberOf QuizComponent
   */
  onSubmit() {
    const unprocessedQuiz = this.quizForm.value

    this.processQuizBeforeSubmit(unprocessedQuiz)

    const submitQuizRequest: SubmitQuizRequest = {
      userId: this.usersService.getUserId(),
      groupId: this.groupDataService.currentGroupId,
      quiz: unprocessedQuiz
    }

    this.quizzesService.submitQuiz(submitQuizRequest)
      .pipe(
        take(1),
        switchMap(() => this.usersService.getUserAccount(this.usersService.getUserId())),
        tap(user => {
          this.userDataService.updateUserScores(user.scores);
        }),
        catchError(error => {
          return throwError(() => error)
        })
      )
      .subscribe({
        next: () => {
          this.applicationHubService
            .submitQuiz(submitQuizRequest.groupId)
            .then(() => {
              this.toast.success({ detail: "Success", summary: 'Quiz submitted successfully! Checkout the scores to see your score!', duration: 3000 })
            })
        }
      });
  }

  /**
   * Description: deletes unnecessary controls from quiz's form.
   * @param quiz - The value of the quiz's form.
   * @private
   * @memberOf QuizComponent
   */
  private processQuizBeforeSubmit(quiz: any) {
    quiz.questions.forEach((question: any) => {
      if (question.selectedAnswer) {
        question.answers.forEach((answer: any) => {
          answer.status = answer.answer === question.selectedAnswer
        })

        delete question.selectedAnswer
      }
    })
  }

  /**
   * Description: loadQuiz method fetches quiz's data without answers.
   * @private
   * @memberOf QuizComponent
   */
  private loadQuiz() {
    this.routerSubscription = this.route.params
      .pipe(
        switchMap(() => {
          const quizId = +this.route.snapshot.paramMap.get('quizId')!
          return this.quizzesService
            .getQuizWithoutCorrectAnswers(quizId)
            .pipe(
              catchError(error => {
                return throwError(() => error)
              })
            )
        })
      )
      .subscribe(quiz => {
        this.quizForm = this.quizzesService.buildQuiz(quiz)
        this.isLoading = false
      })
  }

  ngOnDestroy() {
    this.quizForm.reset()
    this.routerSubscription.unsubscribe()
  }
}
