import {Component, OnInit} from '@angular/core';
import {JsonPipe, NgForOf, NgIf} from "@angular/common";
import {UsersDataService} from "../../../../services/users-data.service";
import {QuizzesDTO} from "../../../../interfaces/quizes-dto";
import {AbstractControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthorisationService} from "../../../../services/authorisation.service";
import {GroupsService} from "../../../../services/groups.service";
import {ActivatedRoute} from "@angular/router";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    NgIf
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {
  quizzes : QuizzesDTO[] = []
  closeResult : string = ''
  quizForm!: FormGroup

  constructor(private userDataService : UsersDataService,
              private auth : AuthorisationService,
              private group : GroupsService,
              private route : ActivatedRoute,
              private modalService: NgbModal,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.quizForm = this.fb.group({
      name: '',
      questions: this.fb.array([
        this.createQuestion()
      ])
    });
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
    return this.quizForm.get('questions') as FormArray
  }

  answers(question: AbstractControl<any>) {
    return question.get('answers') as FormArray
  }

  onSubmitNewQuiz(quizName : string) {
    this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
      const groupID = +this.route.snapshot.paramMap.get('id')!
      console.log(quizName, userID, groupID)
      this.modalService.dismissAll()
    })
  }

  onQuizOpened(quiz : QuizzesDTO, content : any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title-2'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
    })
    console.log(quiz.name, quiz.groupID, quiz.creatorID)
  }

  onSubmitQuizAnswer() {

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
