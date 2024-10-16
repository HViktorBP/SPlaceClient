import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {QuizzesService} from "../../../../services/quizzes.service";
import {NgToastService} from "ng-angular-popup";
import {ActivatedRoute} from "@angular/router";
import {Subscription, switchMap} from "rxjs";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {QuizDto} from "../../../../dtos/quiz/quiz-dto";
import {QuestionDto} from "../../../../dtos/question/question-dto";
import {AnswerDto} from "../../../../dtos/answer/answer-dto";
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    JsonPipe,
    MatProgressSpinner
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent implements OnInit, OnDestroy {
  routerSubscription!: Subscription;
  quizForm: FormGroup;
  isLoading!: boolean;

  constructor(private quizzesService : QuizzesService,
              private toast : NgToastService,
              private route : ActivatedRoute,
              private fb: FormBuilder) {
    this.quizForm = new FormGroup({})
  }

  ngOnInit() {
    this.isLoading = true;
    this.loadQuiz();
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe()
  }

  createQuestionFormGroup(question: QuestionDto): FormGroup {
    return this.fb.group({
      question: [question.question, Validators.required],
      type: [question.type],
      answers: this.fb.array(question.answers.map(answer => this.createAnswerFormGroup(answer)))
    });
  }

  createAnswerFormGroup(answer: AnswerDto): FormGroup {
    return this.fb.group({
      answer: [answer.answer, Validators.required],
      status: [answer.status]
    });
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  getAnswers(i: number): FormArray {
    return this.questions.at(i).get('answers') as FormArray;
  }

  onSubmit(): void {
    if (this.quizForm.valid) {
      console.log(this.quizForm.value);
    }
  }

  private buildQuizForm(quiz : QuizDto) {
    this.quizForm = this.fb.group({
      name: [quiz.name, Validators.required],
      questions: this.fb.array(quiz.questions.map(question => this.createQuestionFormGroup(question)))
    });
  }

  private loadQuiz() {
    this.routerSubscription = this.route.params
      .pipe(
        switchMap(() => {
          const quizId = +this.route.snapshot.paramMap.get('quizId')!;
          return this.quizzesService.getQuiz(quizId)
        })
      )
      .subscribe(quiz => {
        this.buildQuizForm(quiz);
        this.isLoading = false;
      })
  }
}
