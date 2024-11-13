import {Component, inject, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {DeleteQuizRequest} from "../../../../../../data-transferring/contracts/quiz/delete-quiz-request";
import {switchMap, take, tap} from "rxjs";
import {UsersService} from "../../../../../../services/users.service";
import {ApplicationHubService} from "../../../../../../services/application-hub.service";
import {UsersDataService} from "../../../../../../services/states/users-data.service";
import {GroupDataService} from "../../../../../../services/states/group-data.service";
import {QuizzesService} from "../../../../../../services/quizzes.service";
import {NgToastService} from "ng-angular-popup";

/**
 * DeleteQuizComponent provides UI for deleting the quiz.
 */

@Component({
  selector: 'app-delete-quiz',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './delete-quiz.component.html',
  styleUrl: './delete-quiz.component.scss'
})

export class DeleteQuizComponent {
  /**
   * Description: Reference to the component that will be opened in dialog
   */
  public dialogRef = inject(MatDialogRef<DeleteQuizComponent>)

  constructor(
    private usersService : UsersService,
    private userDataService : UsersDataService,
    private applicationHubService : ApplicationHubService,
    private groupDataService : GroupDataService,
    private quizzesService : QuizzesService,
    private toast : NgToastService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  /**
   * Description: cancel the deleting of quiz
   */
  onCancel(): void {
    this.dialogRef.close()
  }

  /**
   * Description: confirming the deleting of quiz
   */
  onDelete(): void {
    const deleteQuizRequest : DeleteQuizRequest = {
      userId: this.usersService.getUserId(),
      groupId: this.groupDataService.currentGroupId,
      quizId: +this.data.quizId
    }

    this.quizzesService.deleteQuiz(deleteQuizRequest)
      .pipe(
        take(1),
        switchMap(() =>
          this.usersService
            .getUserAccount(this.usersService.getUserId())
            .pipe(
              take(1),
              tap(user => {
                this.userDataService.updateCreatedQuizzesData(user.createdQuizzes)
              }))
        )
      )
      .subscribe({
        next: () => {
          this.applicationHubService
            .deleteQuiz(deleteQuizRequest.groupId, deleteQuizRequest.quizId)
            .then(() => {
              this.toast.success({detail: 'Success', summary: 'Quiz deleted!', duration: 3000})
            })
            .finally(() => {
              this.dialogRef.close()
            })
        }
      })
  }
}
