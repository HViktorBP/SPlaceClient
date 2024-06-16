import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, JsonPipe, KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {UsersDataService} from "../../../../services/users-data.service";
import {QuizzesDTO} from "../../../../interfaces/quizzes-dto";
import {AbstractControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserService} from "../../../../services/user.service";
import {GroupsService} from "../../../../services/groups.service";
import {ActivatedRoute} from "@angular/router";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import {QuizzesService} from "../../../../services/quizzes.service";
import {catchError, switchMap, tap, throwError} from "rxjs";
import {QuizModel} from "../../../../interfaces/quiz-model";
import {NgToastService} from "ng-angular-popup";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import { MatDialog } from '@angular/material/dialog';

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
    AsyncPipe,
    FaIconComponent
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss'
})
export class QuizComponent implements OnInit {
  @ViewChild('quizContent') quizContent!: ElementRef
  quizzes : QuizzesDTO[] = []
  closeResult : string = ''
  newQuizForm!: FormGroup
  quizModel!: QuizModel
  private userScore : number = 0
  trash = faTrash;

  constructor(private userDataService : UsersDataService,
              private auth : UserService,
              private group : GroupsService,
              private route : ActivatedRoute,
              private modalService: NgbModal,
              private fb: FormBuilder,
              private quiz: QuizzesService,
              private toast : NgToastService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.newQuizForm = this.fb.group({
      name: '',
      questions: this.fb.array([
        this.createQuestion()
      ])
    }, {validators: [this.atLeastOneQuestion, this.atLeastOneAnswer, this.atLeastOneCorrectAnswer, this.allFieldsFilled]});
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
      status: false
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

  allFieldsFilled(group: FormGroup) {
    const questionsArray = group.get('questions') as FormArray;
    const emptyFields = questionsArray.controls.some(control => {
      const question = control.get('question')!.value;
      const answersArray = control.get('answers') as FormArray;
      const emptyAnswers = answersArray.controls.some(answerControl => {
        return !answerControl.get('answer')!.value;
      });
      return !question || emptyAnswers;
    });
    return emptyFields ? { emptyFields: true } : null;
  }

  atLeastOneCorrectAnswer(group: FormGroup) {
    const questionsArray = group.get('questions') as FormArray;
    const invalidQuestions = questionsArray.controls.some(control => {
      const answersArray = control.get('answers') as FormArray;
      const hasCorrectAnswer = answersArray.controls.some(answerControl => {
        return answerControl.get('status')!.value;
      });
      return !hasCorrectAnswer;
    });
    return invalidQuestions ? { noCorrectAnswer: true } : null;
  }

  onAddQuiz(content: any) {
    this.resetQuiz()

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

  answers(question: AbstractControl<any>) {
    return question.get('answers') as FormArray
  }

  get getUserScore() {
    return this.userScore;
  }

  onSubmitNewQuiz() {
    const groupID = +this.route.snapshot.paramMap.get('id')!;
    this.auth.getUserID(this.auth.getUsername()).pipe(
      switchMap(userID => {
        return this.group.getUserRole(userID, groupID).pipe(
          switchMap(role => {
            return this.quiz.submitNewQuiz(userID, groupID, role, this.newQuizForm.value).pipe(
              tap(res => console.log(res.message)),
              catchError(err => {
                this.toast.error({detail: "Error",summary: err.error.message, duration: 3000});
                return throwError(err);
              })
            );
          }),
          catchError(err => {
            this.toast.error({detail: "Error",summary: err.error.message, duration: 3000});
            return throwError(err);
          })
        );
      })
    ).subscribe(() => {
      this.resetQuiz()
      this.toast.success({detail: "Success",summary: "New quiz uploaded!", duration: 3000});
    });
  }

  async initializeNewQuiz(quiz: QuizModel) {
    this.resetQuiz()

    this.newQuizForm = this.fb.group({
      name: quiz.name,
      questions: this.fb.array([])
    });
    const questions = this.newQuizForm.get('questions') as FormArray;

    await Promise.all(quiz.questions.map(async q => {
      const question = this.fb.group({
        question: q.question,
        answers: this.fb.array([])
      });

      const answers = question.get('answers') as FormArray;
      await Promise.all(q.answers.map(async a => {
        const answer = this.fb.group({
          answer: a.answer,
          status: false
        });
        answers.push(answer);
      }));
      questions.push(question);
    }));
  }

  async onQuizOpened(quiz : QuizzesDTO, content : any) {
    this.resetQuiz()

    const groupId = +this.route.snapshot.paramMap.get('id')!
    sessionStorage.setItem('quiz', quiz.name!)
    this.quiz.getQuizId(groupId, quiz.name!).subscribe({
      next:quizId=> {
        this.quiz.getQuiz(groupId, quizId).subscribe({
          next:async res => {
            this.quizModel = res
            await this.initializeNewQuiz(res);
            this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title-2'}).result.then((result) => {
              this.closeResult = `Closed with: ${result}`
            }, (reason) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
            })
          },
          error:err => {
            this.toast.error({detail: "Error",summary: err.error.message, duration: 3000});
          }
        })
      },
      error:err => {
        this.toast.error({detail: "Error",summary: err.error.message, duration: 3000});
      }
    })
  }

  openResult(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title-3'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
    })
  }

  onSubmitQuizAnswered(content: any) {
    const formValue = this.newQuizForm.value;

    this.auth.getUserID(this.auth.getUsername()).subscribe({
      next:userID => {
        const groupID : number = +this.route.snapshot.paramMap.get('id')!
        this.quiz.getQuizId(groupID, this.quizModel.name!).subscribe({
          next:quizID => {
            this.quiz.submitQuizResult(userID, groupID, quizID, formValue).subscribe({
              next: result => {
                this.userScore = result.score
                this.openResult(content)
              },
              error:err => {
                this.toast.error({detail: "Error",summary: err.error.message, duration: 3000});
              }
            })
          },
          error:err => {
            this.toast.error({detail: "Error",summary: err.error.message, duration: 3000});
          }
        })
      },
      error:err => {
        this.toast.error({detail: "Error",summary: err.error.message, duration: 3000});
      }
  })

    this.resetQuiz()
  }

  deleteQuiz(quiz: QuizzesDTO) {
    this.auth.getUserID(this.auth.getUsername()).subscribe({
      next:userID => {
        this.group.getUserRole(userID, quiz.groupID!).subscribe({
          next: role => {
            this.quiz.deleteQuiz(quiz, userID, role).subscribe({
              next:res => {
                this.toast.success({detail:"Success", summary: res.message, duration: 3000})
              },
              error:err => {
                this.toast.error({detail:"Error", summary: err.error.message, duration: 3000})
              }
            })
          },
          error:err => {
            this.toast.error({detail:"Error", summary: err.error.message, duration: 3000})
          }
        })
      },
      error:err => {
        this.toast.error({detail:"Error", summary: err.error.message, duration: 3000})
      }
    })
  }

  private getDismissReason(reason: any): string {
    sessionStorage.setItem('quiz', 'none')
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private resetQuiz() {
    this.newQuizForm.reset();
    const questionsArray = this.newQuizForm.get('questions') as FormArray;
    questionsArray.clear();
    this.modalService.dismissAll()
  }

  openConfirmationDialog(quiz: QuizzesDTO): void {
    this.deleteQuiz(quiz);
  }
}
