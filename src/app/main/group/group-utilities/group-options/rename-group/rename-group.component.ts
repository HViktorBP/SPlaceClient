import {Component, inject} from '@angular/core';
import {UsersService} from "../../../../../services/users.service";
import {GroupsService} from "../../../../../services/groups.service";
import {NgToastService} from "ng-angular-popup";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RenameGroupRequest} from "../../../../../data-transferring/contracts/group/rename-group-request";
import {GroupDataService} from "../../../../../states/group-data.service";
import {take} from "rxjs";
import {ApplicationHubService} from "../../../../../services/application-hub.service";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-rename-group',
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
    MatLabel
  ],
  templateUrl: './rename-group.component.html',
  styleUrl: './rename-group.component.scss'
})

export class RenameGroupComponent {
  readonly dialogRef = inject(MatDialogRef<RenameGroupComponent>);

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private applicationHubService : ApplicationHubService,
              private toast : NgToastService,
              private groupDataService : GroupDataService) { }

  onSubmit(form: NgForm) {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    const renameGroupRequest : RenameGroupRequest = {
      userId : userId,
      groupId : groupId,
      newGroupName : form.value.groupName,
    }

    this.groupService.renameGroup(renameGroupRequest)
      .pipe(take(1))
      .subscribe({
        next : res => {
          this.applicationHubService.renameGroup(renameGroupRequest.groupId)
            .then(
              () => {
                this.toast.info({detail:"Info", summary: res.message, duration:3000})
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
