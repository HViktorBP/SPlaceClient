import {Component, inject} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GroupsService} from "../../../../../services/groups.service";
import {FormsModule, NgForm} from "@angular/forms";
import {UsersService} from "../../../../../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {AddUserRequest} from "../../../../../data-transferring/contracts/group/add-user-request";
import {GroupDataService} from "../../../../../states/group-data.service";
import {take} from "rxjs";
import {ApplicationHubService} from "../../../../../services/application-hub.service";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-add-user',
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
    MatSelect,
    MatOption
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  readonly dialogRef = inject(MatDialogRef<AddUserComponent>);

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private groupDataService : GroupDataService,
              private toast : NgToastService,
              private applicationHubService : ApplicationHubService) {
  }

  onSubmit(form: NgForm) {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    const addUserRequest : AddUserRequest = {
      userId : userId,
      groupId : groupId,
      userToAddName : form.value.userName,
      role : +form.value.userRole
    }

    this.groupService.addUser(addUserRequest)
      .pipe(take(1))
      .subscribe({
        next : res => {
          this.applicationHubService.addToGroup(addUserRequest.groupId, addUserRequest.userToAddName)
            .then(
              () => {
                this.toast.success({detail:"Info", summary: res.message, duration:3000})
              }
            )
            .catch(error => {
              this.toast.success({detail:"Error", summary: error, duration:3000})
            })

          this.dialogRef.close()
        },
        error : err => {
          this.toast.error({detail:"Error", summary: err, duration:3000})
        }
      })
  }
}
