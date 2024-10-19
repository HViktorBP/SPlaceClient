import {Component, Input} from '@angular/core';
import {AsyncPipe, JsonPipe, KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialog} from '@angular/material/dialog';
import {GroupDataService} from "../../../../states/group-data.service";
import { CreateQuizComponent } from "./create-quiz/create-quiz.component";
import {RouterLink} from "@angular/router";
import {PopUpService} from "../../../../services/pop-up.service";
import {NgToastService} from "ng-angular-popup";
import {UsersService} from "../../../../services/users.service";
import {QuizzesService} from "../../../../services/quizzes.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {MatButton} from "@angular/material/button";
import {DeleteQuizComponent} from "./delete-quiz/delete-quiz.component";
import {DeleteQuizRequest} from "../../../../contracts/quiz/delete-quiz-request";
import {take} from "rxjs";
import {EditQuizComponent} from "./edit-quiz/edit-quiz.component";

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    NgIf,
    KeyValuePipe,
    AsyncPipe,
    RouterLink,
    FaIconComponent,
    MatButton,
  ],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.scss'
})

export class QuizListComponent {
  @Input()isCreator!: boolean;
  @Input()isAdministrator!: boolean;

  constructor(public groupDataService : GroupDataService,
              public dialog: MatDialog,
              public popUpService : PopUpService,
              private toast : NgToastService,
              private usersService : UsersService,
              private quizzesService : QuizzesService) {
  }

  createQuiz() {
    const dialogRef = this.dialog.open(CreateQuizComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Quiz Data:', result);
      }
    });
  }

  openDeleteDialog(quizName: string, quizId: number): void {
    const dialogRef = this.dialog.open(DeleteQuizComponent, {
      width: '300px',
      data: { quizName: quizName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const deleteQuizRequest : DeleteQuizRequest = {
          userId: this.usersService.getUserId(),
          groupId: this.groupDataService.currentGroupId,
          quizId: quizId
        }

        this.quizzesService.deleteQuiz(deleteQuizRequest)
          .pipe(take(1))
          .subscribe({
            next: (res) => {
              this.toast.success({detail: 'Success', summary: res, duration: 3000});
            },
            error: (err) => {
              this.toast.error({detail: 'Error', summary: err, duration: 3000});
            }
          });
      }
    });
  }

  openEditQuizDialog(quizId : number) {
    this.dialog.open(EditQuizComponent, {
      width: '600px',
      data: { quizId: quizId }
    });
  }
}
