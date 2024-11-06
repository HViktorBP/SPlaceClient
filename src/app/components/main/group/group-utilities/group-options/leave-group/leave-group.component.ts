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
import {catchError, switchMap, take, throwError} from "rxjs";
import {ApplicationHubService} from "../../../../../../services/application-hub.service";
import {map} from "rxjs/operators";
import {UsersDataService} from "../../../../../../services/states/users-data.service";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

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
  readonly dialogRef = inject(MatDialogRef<LeaveGroupComponent>)

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private groupDataService : GroupDataService,
              private userDataService : UsersDataService,
              private applicationHubService : ApplicationHubService,
              private toast : NgToastService,
              private router : Router) {
  }

  onSubmit() {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    const leaveGroupRequest : UserGroupRequest = {
      userId : userId,
      groupId : groupId
    }

    this.groupService.leaveGroup(leaveGroupRequest)
      .pipe(
        take(1),
        switchMap(() => {
          return this.userService.getUserAccount(this.userService.getUserId())
            .pipe(
              map(user => user.groups)
            )
        }),
        catchError(error => {
          return throwError(() => error)
        })
      )
      .subscribe({
        next : groups => {
          this.userDataService.updateGroupData(groups)
          this.applicationHubService.leaveTheGroup(leaveGroupRequest.groupId)
            .then(() => {
                this.toast.info({detail:"Info", summary: 'You left the group', duration:3000})
                this.router.navigate(['main/home']).then(
                  () => this.dialogRef.close()
                )
              }
            )
        }
      })
  }
}
