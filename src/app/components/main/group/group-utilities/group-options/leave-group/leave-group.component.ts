import {Component, inject} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GroupsService} from "../../../../../../services/groups.service";
import {UsersService} from "../../../../../../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserGroupRequest} from "../../../../../../data-transferring/contracts/group/user-group-request";
import {GroupDataService} from "../../../../../../services/states/group-data.service";
import {catchError, switchMap, take, tap, throwError} from "rxjs";
import {ApplicationHubService} from "../../../../../../services/application-hub.service";
import {UsersDataService} from "../../../../../../services/states/users-data.service";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

/**
 * LeaveGroupComponent provides UI for leaving the group.
 */

@Component({
  selector: 'app-leave-group',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './leave-group.component.html',
  styleUrl: './leave-group.component.scss'
})

export class LeaveGroupComponent {
  /**
   * Description: MatDialog reference to LeaveGroupComponent
   */
  readonly dialogRef = inject(MatDialogRef<LeaveGroupComponent>)

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private groupDataService : GroupDataService,
              private userDataService : UsersDataService,
              private applicationHubService : ApplicationHubService,
              private toast : NgToastService,
              private router : Router) {
  }

  /**
   * Description: onSubmit method calls a function that sends an HTTP request for leaving the group and handles the UI according to the request's response.
   * If the operation successful, it updates the UI for all other users who participate in group by calling an applicationHub's leaveGroup method.
   * @see ApplicationHubService
   */
  onSubmit() {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    const leaveGroupRequest : UserGroupRequest = {
      userId : userId,
      groupId : groupId
    }

    const usersQuizzes = this.userDataService.createdQuizzes

    this.groupService
      .leaveGroup(leaveGroupRequest)
      .pipe(
        take(1),
        switchMap(() => {
          return this.userService.getUserAccount(this.userService.getUserId())
        }),
        tap((user) => {
          this.userDataService.updateGroupData(user.groups)
          this.userDataService.updateCreatedQuizzesData(user.createdQuizzes)
          this.userDataService.updateUserScores(user.scores)
        }),
        catchError(error => {
          return throwError(() => error)
        })
      )
      .subscribe({
        next : () => {
          this.applicationHubService
            .leaveGroup(leaveGroupRequest.groupId)
            .then(() => {
              this.toast.info({detail:"Info", summary: 'You left the group.', duration:3000})
              usersQuizzes.forEach(userQuiz => {
                if (userQuiz.groupId === this.groupDataService.currentGroupId) {
                  this.applicationHubService
                    .deleteQuiz(this.groupDataService.currentGroupId, userQuiz.id).then(() => {
                    console.log(userQuiz.name)
                  })
                }
              })
            })
            .finally(() => {
                this.router
                  .navigate(['/main'])
                  .then(() => {
                    this.dialogRef.close()
                  })
            })
        }
      })
  }
}
