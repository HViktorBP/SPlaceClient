import {Component, Input} from '@angular/core';
import {AsyncPipe, JsonPipe, KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialog} from '@angular/material/dialog';
import {GroupDataService} from "../../../../states/group-data.service";
import { CreateQuizComponent } from "./create-quiz/create-quiz.component";
import {RouterLink} from "@angular/router";
import {NgToastService} from "ng-angular-popup";
import {UsersService} from "../../../../services/users.service";
import {QuizzesService} from "../../../../services/quizzes.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {MatButton, MatIconButton} from "@angular/material/button";
import {DeleteQuizComponent} from "./delete-quiz/delete-quiz.component";
import {DeleteQuizRequest} from "../../../../data-transferring/contracts/quiz/delete-quiz-request";
import {switchMap, take, tap} from "rxjs";
import {EditQuizComponent} from "./edit-quiz/edit-quiz.component";
import {ApplicationHubService} from "../../../../services/application-hub.service";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";
import {UsersDataService} from "../../../../states/users-data.service";
import {MatIcon} from "@angular/material/icon";

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
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatList,
    MatListItem,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.scss'
})

export class QuizListComponent {
  @Input()isCreator!: boolean;
  @Input()isAdministrator!: boolean;

  constructor(public groupDataService : GroupDataService,
              private userDataService : UsersDataService,
              public dialog: MatDialog,
              public applicationHubService : ApplicationHubService,
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
            next: () => {
              this.applicationHubService.deleteQuiz(deleteQuizRequest.groupId)
                .then(() => {
                  this.toast.success({detail: 'Success', summary: 'Quiz deleted!', duration: 3000});
                })
                .catch(err => {
                  this.toast.error({detail: 'Error', summary: err, duration: 3000});
                })
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
