import {Component, inject} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule, NgForm} from "@angular/forms";
import {UsersService} from "../../../../../services/users.service";
import {GroupsService} from "../../../../../services/groups.service";
import {NgToastService} from "ng-angular-popup";
import {RemoveUserRequest} from "../../../../../data-transferring/contracts/group/remove-user-request";
import {GroupDataService} from "../../../../../states/group-data.service";
import {take} from "rxjs";
import {ApplicationHubService} from "../../../../../services/application-hub.service";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-remove-user',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent,
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect
  ],
  templateUrl: './remove-user.component.html',
  styleUrl: './remove-user.component.scss'
})
export class RemoveUserComponent {
  readonly dialogRef = inject(MatDialogRef<RemoveUserComponent>);

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private groupDataService : GroupDataService,
              private applicationHubService : ApplicationHubService,
              private toast : NgToastService) {
  }

  onSubmit(form: NgForm) {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    const removeUserRequest : RemoveUserRequest = {
      userId : userId,
      groupId : groupId,
      userToDeleteName : form.value.userName,
    }

    this.groupService.removeUser(removeUserRequest)
      .pipe(take(1))
      .subscribe({
        next : res => {
          this.applicationHubService.removeUser(removeUserRequest.userToDeleteName, removeUserRequest.groupId)
            .then(
              () => {
                this.toast.success({detail:"Info", summary: res.message, duration:3000})
                this.dialogRef.close()
              }
            )
            .catch(error => {
              this.toast.success({detail:"Error", summary: error, duration:3000})
            })
        },
        error : err => {
          this.toast.error({detail:"Error", summary: err, duration:3000})
        }
      })
  }
}
