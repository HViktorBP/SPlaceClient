import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {QuizzesService} from "../../../../services/quizzes.service";
import {NgToastService} from "ng-angular-popup";
import {ActivatedRoute} from "@angular/router";
import {Subscription, switchMap, take, tap} from "rxjs";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SubmitQuizRequest} from "../../../../contracts/quiz/submit-quiz-request";
import {UsersService} from "../../../../services/users.service";
import {GroupDataService} from "../../../../states/group-data.service";
import {Question} from "../../../../enums/question";

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    JsonPipe,
    MatProgressSpinner,
    ReactiveFormsModule
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent implements OnInit, OnDestroy {
  routerSubscription!: Subscription;
  quizForm: FormGroup;
  isLoading!: boolean;
  protected readonly Question = Question;

  constructor(
    private quizzesService: QuizzesService,
    private toast: NgToastService,
    private usersService: UsersService,
    private groupDataService: GroupDataService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.quizForm = this.fb.group({
      name: ['', Validators.required],
      questions: this.fb.array([])
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.loadQuiz();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  get questions() {
    return this.quizForm.get('questions') as FormArray;
  }

  getAnswers(i: number) {
    return this.questions.at(i).get('answers') as FormArray;
  }

  onSubmit() {
    if (this.quizForm.valid) {
      const unprocessedQuiz = this.quizForm.value

      this.processQuizBeforeSubmit(unprocessedQuiz);

      const submitQuizRequest: SubmitQuizRequest = {
        userId: this.usersService.getUserId(),
        groupId: this.groupDataService.currentGroupId,
        quiz: unprocessedQuiz
      };


      this.quizzesService.submitQuiz(submitQuizRequest)
        .pipe(take(1))
        .subscribe({
          next: (res) => {
            this.toast.success({ detail: "Success", summary: res, duration: 3000 });
          },
          error: (err) => {
            this.toast.error({ detail: "Error", summary: err, duration: 3000 });
          }
        });
    }
  }

  private processQuizBeforeSubmit(quiz: any) {
    quiz.questions.forEach((question: any) => {
      if (question.selectedAnswer) {
        question.answers.forEach((answer: any) => {
          answer.status = answer.answer === question.selectedAnswer;
        });

        delete question.selectedAnswer;
      }
    });
  }

  private loadQuiz() {
    this.routerSubscription = this.route.params
      .pipe(
        switchMap(() => {
          const quizId = +this.route.snapshot.paramMap.get('quizId')!;
          return this.quizzesService.getQuiz(quizId).pipe(
            tap(quiz => {
              quiz.questions.forEach(question => {
                question.answers.forEach(answer => {
                  answer.status = false;
                })
              })
              return quiz;
            })
          );
        })
      )
      .subscribe(quiz => {
        console.log(quiz)
        this.quizForm = this.quizzesService.buildQuiz(quiz)
        this.isLoading = false;
      });
  }

}
