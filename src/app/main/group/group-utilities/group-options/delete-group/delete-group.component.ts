import {Component, inject} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GroupsService} from "../../../../../services/groups.service";
import {UsersService} from "../../../../../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserGroupRequest} from "../../../../../data-transferring/contracts/group/user-group-request";
import {GroupDataService} from "../../../../../states/group-data.service";
import {switchMap, take, tap} from "rxjs";
import {ApplicationHubService} from "../../../../../services/application-hub.service";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {UsersDataService} from "../../../../../states/users-data.service";

@Component({
  selector: 'app-delete-group',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatDialogTitle
  ],
  templateUrl: './delete-group.component.html',
  styleUrl: './delete-group.component.scss'
})
export class DeleteGroupComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteGroupComponent>);

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private groupDataService : GroupDataService,
              private userDataService : UsersDataService,
              private applicationHubService : ApplicationHubService,
              private toast : NgToastService) {
  }

  onSubmit() {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    const deleteGroupRequest : UserGroupRequest = {
      userId : userId,
      groupId : groupId,
    }

    this.groupService.deleteGroup(deleteGroupRequest)
      .pipe(
        take(1),
        switchMap(() =>
          this.userService.getUserAccount(this.userService.getUserId()).pipe(
            take(1),
            tap(user => {
              this.userDataService.updateCreatedGroupData(user.createdGroups);
              this.userDataService.updateCreatedQuizzesData(user.createdQuizzes);
            })
          )
        )
      )
      .subscribe({
        next : () => {
          this.applicationHubService.deleteGroup(deleteGroupRequest.groupId)
            .then(() => {
              this.dialogRef.close();
            })
            .catch(error => {
              this.toast.error({detail:"Error", summary: error, duration:3000})
            })
        },
        error : err => {
          this.toast.error({detail:"Error", summary: err, duration:3000})
        }
      })

  }
}
