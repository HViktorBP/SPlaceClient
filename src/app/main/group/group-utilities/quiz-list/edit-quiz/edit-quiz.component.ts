import {Component, Inject, OnInit} from '@angular/core';
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
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {QuizzesService} from "../../../../../services/quizzes.service";
import {take} from "rxjs";
import {NgToastService} from "ng-angular-popup";
import {MatOption, MatSelect} from "@angular/material/select";
import {UsersService} from "../../../../../services/users.service";
import {GroupDataService} from "../../../../../states/group-data.service";
import {SubmitQuizRequest} from "../../../../../contracts/quiz/submit-quiz-request";

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
    MatHint
  ],
  templateUrl: './edit-quiz.component.html',
  styleUrl: './edit-quiz.component.scss'
})
export class EditQuizComponent implements OnInit{
  quizForm!: FormGroup
  isLoading!: boolean;

  constructor(private fb: FormBuilder,
              private quizzesService : QuizzesService,
              private usersService : UsersService,
              private groupDataService : GroupDataService,
              private toast : NgToastService,
              public dialogRef: MatDialogRef<EditQuizComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.initializeForm();
  }

  initializeForm() {
    this.quizzesService.getQuiz(this.data.quizId)
      .pipe(take(1))
      .subscribe({
        next : (quiz) => {
          this. quizForm = this.quizzesService.buildQuiz(quiz)

          this.isLoading = false;
        },
        error : (err) => {
          this.toast.error({detail: 'Error', summary: err, duration: 3000});
        }
      });
  }

  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray;
  }

  createQuestion(): FormGroup {
    return this.fb.group({
      id: 0,
      question: ['', Validators.required],
      type: [0, Validators.required],
      selectedAnswer : '',
      answers: this.fb.array([this.createAnswer()])
    });
  }

  createAnswer(): FormGroup {
    return this.fb.group({
      id: 0,
      answer: ['', Validators.required],
      status: [false]
    });
  }

  addQuestion() {
    this.questions.push(this.createQuestion());
  }

  addAnswer(questionIndex: number) {
    this.getAnswers(questionIndex).push(this.createAnswer());
  }

  removeQuestion(index: number) {
    this.questions.removeAt(index);
  }

  removeAnswer(questionIndex: number, answerIndex: number) {
    this.getAnswers(questionIndex).removeAt(answerIndex);
  }

  getAnswers(i: number): FormArray {
    return this.questions.at(i).get('answers') as FormArray;
  }

  addSingleAnswer(index : number) {
    let questionFormGroup  = this.questions.at(index) as FormGroup;

    questionFormGroup.addControl('selectedAnswer', new FormControl(''));
  }

  removeSingleAnswer(index : number) {
    let questionFormGroup = this.questions.at(index) as FormGroup;

    if (questionFormGroup.contains('selectedAnswer')) {
      questionFormGroup.removeControl('selectedAnswer');
    } else {
      console.warn('selectedAnswer does not exist on this question.');
    }
  }

  onEdit() {
    if (this.quizForm.valid) {
      this.dialogRef.close(true);
      const quizData = this.quizForm.value;

      this.processQuizBeforeSubmit(quizData)

      const editQuizRequest: SubmitQuizRequest = {
        userId: this.usersService.getUserId(),
        groupId: this.groupDataService.currentGroupId,
        quiz: quizData
      }

      console.log('Quiz Data:', quizData);

      this.quizzesService.editQuiz(editQuizRequest)
        .pipe(take(1))
        .subscribe({
          next : (res) => {
            this.toast.success({detail: 'Success', summary: res, duration: 3000});
          },
          error : (err) => {
            this.toast.error({detail: 'Error', summary: err, duration: 3000});
          }
        })
    }
  }

  onCancel(): void {
    this.quizForm.reset();
    this.dialogRef.close(false);
  }

  private processQuizBeforeSubmit(quiz: any) {
    quiz.questions.forEach((question: any, index : number) => {
      if (question.selectedAnswer) {
        question.answers.forEach((answer: any) => {
          answer.status = answer.answer === question.selectedAnswer;
        });

        this.removeSingleAnswer(index)
        console.log('deleted ' + question.question);
        delete question.selectedAnswer;
      }
    });

    console.log(quiz)
  }
}
