import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, JsonPipe, KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {UsersDataService} from "../../../../services/users-data.service";
import {QuizzesDTO} from "../../../../interfaces/quizes-dto";
import {AbstractControl, Form, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthorisationService} from "../../../../services/authorisation.service";
import {GroupsService} from "../../../../services/groups.service";
import {ActivatedRoute} from "@angular/router";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import {QuizzesService} from "../../../../services/quizzes.service";
import {catchError, switchMap, tap, throwError} from "rxjs";
import {QuizModel} from "../../../../interfaces/quiz-model";
import {QuestionsModel} from "../../../../interfaces/questions-model";
import {AnswerModel} from "../../../../interfaces/answer-model";

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    NgIf,
    KeyValuePipe,
    AsyncPipe
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {
  @ViewChild('quizContent') quizContent!: ElementRef
  quizzes : QuizzesDTO[] = []
  closeResult : string = ''
  newQuizForm!: FormGroup
  retrievedQuizForm!: FormGroup
  quizModel!: QuizModel

  constructor(private userDataService : UsersDataService,
              private auth : AuthorisationService,
              private group : GroupsService,
              private route : ActivatedRoute,
              private modalService: NgbModal,
              private fb: FormBuilder,
              private quiz: QuizzesService) {
  }

  ngOnInit() {
    this.newQuizForm = this.fb.group({
      name: '',
      questions: this.fb.array([
        this.createQuestion()
      ])
    }, {validators: [this.atLeastOneQuestion, this.atLeastOneAnswer]});
    this.userDataService.quizList$.subscribe(list => this.quizzes = list)
  }
  createQuestion() {
    return this.fb.group({
      question: '',
      answers: this.fb.array([
        this.createAnswer()
      ])
    });
  }

  createAnswer() {
    return this.fb.group({
      answer: '',
      isCorrect: false
    });
  }

  atLeastOneQuestion(group: FormGroup) {
    const questionsArray = group.get('questions') as FormArray;
    return questionsArray && questionsArray.length > 0 ? null : { noQuestions: true };
  }

  atLeastOneAnswer(group: FormGroup) {
    const questionsArray = group.get('questions') as FormArray;
    const invalidQuestions = questionsArray.controls.filter(control => {
      const answersArray = control.get('answers') as FormArray;
      return !answersArray || answersArray.length === 0;
    });
    return invalidQuestions.length === 0 ? null : { noAnswers: true };
  }
  onAddQuiz(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
    })
  }
  onAddQuestion() {
    this.questions.push(this.createQuestion())
  }
  onDeleteQuestion(index: number) {
    this.questions.removeAt(index)
  }
  onAddAnswers(question: AbstractControl<any>) {
    const answers = question.get('answers') as FormArray;
    answers.push(this.createAnswer());
  }
  onDeleteAnswer(index: number, question: AbstractControl<any>) {
    const answers = question.get('answers') as FormArray;
    answers.removeAt(index)
  }
  get questions() {
    return this.newQuizForm.get('questions') as FormArray
  }

  get questionsRetrieved() {
    return this.retrievedQuizForm.get('questionsRetrieved') as FormArray
  }

  answers(question: AbstractControl<any>) {
    return question.get('answers') as FormArray
  }

  answersRetrieved(questionRetrieved: AbstractControl<any>) {
    return questionRetrieved.get('answersRetrieved') as FormArray
  }

  onSubmitNewQuiz() {
    const groupID = +this.route.snapshot.paramMap.get('id')!;
    this.auth.getUserID(this.auth.getUsername()).pipe(
      switchMap(userID => {
        console.log(userID, groupID, this.newQuizForm.value);
        return this.group.getUserRole(userID, groupID).pipe(
          switchMap(role => {
            return this.quiz.submitNewQuiz(userID, groupID, role, this.newQuizForm.value).pipe(
              tap(res => console.log(res.message)),
              catchError(err => {
                console.error(err.message);
                return throwError(err);
              })
            );
          }),
          catchError(err => {
            console.error(err.message);
            return throwError(err);
          })
        );
      }),
      switchMap(() => this.quiz.getQuizzesInGroup(groupID)),
      catchError(err => {
        console.error(err.message);
        return throwError(err);
      })
    ).subscribe(quizzes => {
      this.userDataService.updateQuizzesList(quizzes);
      this.newQuizForm.reset();
      const questionsArray = this.newQuizForm.get('questions') as FormArray;
      questionsArray.clear();
      this.modalService.dismissAll();
    });
  }

  async initializeNewQuiz(quiz: QuizModel) {
    this.retrievedQuizForm = this.fb.group({
      name: quiz.name,
      questionsRetrieved: this.fb.array([])
    });
    const questions = this.retrievedQuizForm.get('questionsRetrieved') as FormArray;

    await Promise.all(quiz.questions.map(async q => {
      const question = this.fb.group({
        question: q.question,
        answersRetrieved: this.fb.array([])
      });

      const answers = question.get('answersRetrieved') as FormArray;
      await Promise.all(q.answers.map(async a => {
        const answer = this.fb.group({
          answer: a.answer,
          isCorrect: false
        });
        answers.push(answer);
      }));
      questions.push(question);
    }));

  }


  async onQuizOpened(quiz : QuizzesDTO, content : any) {
    this.modalService.dismissAll()
    const groupId = +this.route.snapshot.paramMap.get('id')!

    this.quiz.getQuizId(groupId, quiz.name!).subscribe( quizId => {
      this.quiz.getQuiz(groupId, quizId).subscribe(async res => {
        this.quizModel = res
        await this.initializeNewQuiz(res);
        console.log(this.retrievedQuizForm)
        this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title-2'}).result.then((result) => {
          this.closeResult = `Closed with: ${result}`
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
        })
      })
    })
  }

  onSubmitQuizAnswered() {
    const formValue = this.retrievedQuizForm.value;
    console.log('Selected answers:', formValue);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
