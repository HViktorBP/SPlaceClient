import {Component, inject} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {UsersService} from "../../../../../services/users.service";
import {GroupsService} from "../../../../../services/groups.service";
import {NgToastService} from "ng-angular-popup";
import {ChangeRoleRequest} from "../../../../../contracts/group/change-role-request";
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
  selector: 'app-change-role',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule,
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
  templateUrl: './change-role.component.html',
  styleUrl: './change-role.component.scss'
})

export class ChangeRoleComponent {
  readonly dialogRef = inject(MatDialogRef<ChangeRoleComponent>);

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private applicationHubService : ApplicationHubService,
              private toast : NgToastService,
              private groupDataService : GroupDataService) {
  }

  onSubmit(form: NgForm) {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    const addUserRequest : ChangeRoleRequest = {
      userId : userId,
      groupId : groupId,
      userName : form.value.userName,
      role : +form.value.userRole
    }

    this.groupService.changeRole(addUserRequest)
      .pipe(take(1))
      .subscribe({
        next : (res) => {
          this.applicationHubService.changeRole(addUserRequest.userName, addUserRequest.role, addUserRequest.groupId)
            .then(() => {
              this.toast.success({detail:"Success", summary: res.message, duration:3000})
              this.dialogRef.close()
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
