import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDialogActions, MatDialogContainer, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {NgForOf} from "@angular/common";
import {QuizzesService} from "../../../../../services/quizzes.service";
import {GroupDataService} from "../../../../../states/group-data.service";
import {UsersService} from "../../../../../services/users.service";
import {CreateQuizRequest} from "../../../../../data-transferring/contracts/quiz/create-quiz-request";
import {switchMap, take, tap} from "rxjs";
import {NgToastService} from "ng-angular-popup";
import {ApplicationHubService} from "../../../../../services/application-hub.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {UsersDataService} from "../../../../../states/users-data.service";

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
    MatDialogContainer
  ],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.scss'
})

export class CreateQuizComponent implements OnInit {
  quizForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private quizzesService : QuizzesService,
    private usersService : UsersService,
    private groupDataService : GroupDataService,
    private toast : NgToastService,
    private applicationHubService : ApplicationHubService,
    private userDataService : UsersDataService,
    public dialogRef: MatDialogRef<CreateQuizComponent>
  ) {}

  ngOnInit() {
    this.quizForm = this.fb.group({
      name: ['', Validators.required],
      questions: this.fb.array([])
    });
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  newQuestion(): FormGroup {
    return this.fb.group({
      question: ['', Validators.required],
      type: [1, Validators.required],
      answers: this.fb.array([])
    });
  }

  addQuestion() {
    this.questions.push(this.newQuestion());
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  getAnswers(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('answers') as FormArray;
  }

  newAnswer(): FormGroup {
    return this.fb.group({
      answer: ['', Validators.required],
      status: [false]
    });
  }

  addAnswer(questionIndex: number) {
    this.getAnswers(questionIndex).push(this.newAnswer());
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    this.getAnswers(questionIndex).removeAt(answerIndex);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.quizForm.valid) {
      const quizDto = this.quizForm.value

      const createQuizRequest : CreateQuizRequest = {
        userId: this.usersService.getUserId(),
        groupId: this.groupDataService.currentGroupId,
        quiz: quizDto
      }

      this.quizzesService.createNewQuiz(createQuizRequest)
        .pipe(
          take(1),
            switchMap(() =>
              this.usersService.getUserAccount(this.usersService.getUserId()).pipe(
                take(1),
                tap(user => {
                  this.userDataService.updateCreatedQuizzesData(user.createdQuizzes)
                })
              )
            )
          )
        .subscribe({
          next : () => {
            this.applicationHubService.createQuiz(createQuizRequest.groupId)
              .then(() => {
                this.toast.success({detail:"Success", summary: "Quiz is created!", duration:3000})
                this.dialogRef.close(quizDto);
              })
              .catch(err => {
                this.toast.error({detail:"Error", summary: err, duration:3000})
              })
          },
          error: (err) => {
            this.toast.error({detail:"Error", summary: err, duration:3000})
          }
        })
    }
  }
}
