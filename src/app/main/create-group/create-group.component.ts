import {Component, inject} from '@angular/core';
import {GroupsService} from "../../services/groups.service";
import {UsersService} from "../../services/users.service";
import {CreateGroupRequest} from "../../data-transferring/contracts/group/create-group-request";
import {FormsModule, NgForm} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {switchMap, take, tap} from "rxjs";
import {UsersDataService} from "../../states/users-data.service";
import {ApplicationHubService} from "../../services/application-hub.service";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel
  ],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss'
})
export class CreateGroupComponent {
  readonly dialogRef = inject(MatDialogRef<CreateGroupComponent>);

  constructor(private groupService : GroupsService,
              private toast : NgToastService,
              private applicationHubService : ApplicationHubService,
              private usersDataService : UsersDataService,
              private userService : UsersService) {

  }

  onSubmit(form: NgForm) {
    const userId = this.userService.getUserId();

    const createGroupRequest: CreateGroupRequest = {
      userId: userId,
      groupName: form.value.groupName
    };

    this.groupService.createGroup(createGroupRequest)
      .pipe(
        take(1),
        switchMap(() => this.userService.getUserAccount(userId).pipe(
          take(1),
          tap(account => {
            this.usersDataService.updateCreatedQuizzesData(account.createdQuizzes);
          })
        ))
      )
      .subscribe({
        next: user => {
          this.usersDataService.updateCreatedGroupData(user.createdGroups);
          this.usersDataService.updateGroupData(user.groups);

          const newGroup = user.createdGroups.find(g => g.name === createGroupRequest.groupName)!;
          this.applicationHubService.setGroupConnection(newGroup.id).then(() => {
            this.toast.success({ detail: "Success", summary: 'Group created successfully!', duration: 3000 });
          })

          this.dialogRef.close();
        },
        error: err => {
          this.toast.error({ detail: "Error", summary: err, duration: 3000 });
        }
      });
  }

}
