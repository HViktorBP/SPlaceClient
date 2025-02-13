import {Component, inject} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UsersService} from "../../../../../../services/users.service";
import {GroupsService} from "../../../../../../services/groups.service";
import {NgToastService} from "ng-angular-popup";
import {RemoveUserRequest} from "../../../../../../data-transferring/contracts/group/remove-user-request";
import {GroupDataService} from "../../../../../../services/states/group-data.service";
import {catchError, finalize, throwError} from "rxjs";
import {ApplicationHubService} from "../../../../../../services/application-hub.service";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {CustomPopUpForm} from "../../../../../../custom/interfaces/CustomPopUpForm";

/**
 * RemoveUserComponent provides UI for removing user from the group.
 */

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
    MatSelect,
    ReactiveFormsModule,
    MatError,
    NgIf
  ],
  templateUrl: './remove-user.component.html',
  styleUrl: './remove-user.component.scss'
})

export class RemoveUserComponent implements CustomPopUpForm {
  /**
   * Description: MatDialog reference to RemoveUserComponent
   */
  readonly dialogRef = inject(MatDialogRef<RemoveUserComponent>)

  /**
   * Description: Form for removing user
   */
  removeUserForm!: FormGroup

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private groupDataService : GroupDataService,
              private applicationHubService : ApplicationHubService,
              private toast : NgToastService,
              private fb : FormBuilder) {
  }


  ngOnInit(): void {
    this.removeUserForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]]
    })
  }

  /**
   * Description: onSubmit method calls a function that sends an HTTP request for removing user from the group and handles the UI according to the request's response.
   * If the operation successful, it updates the UI for all other users who participate in group and also for user who has been removed by calling an applicationHub's removeUser method.
   @see ApplicationHubService
   */
  onSubmit() {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    this.removeUserForm.disable()

    const removeUserRequest : RemoveUserRequest = {
      userId : userId,
      groupId : groupId,
      userToDeleteName : this.removeUserForm.get('userName')!.value
    }

    this.groupService.removeUser(removeUserRequest)
      .pipe(
        catchError(error => {
          return throwError(() => error)
        }),
        finalize(() => {
          this.removeUserForm.enable()
        })
      )
      .subscribe({
        next : res => {
          this.applicationHubService
            .removeUser(removeUserRequest.userToDeleteName, removeUserRequest.groupId)
            .then(() => {
                this.toast.success({detail:"Info", summary: res.message, duration:3000})
                this.dialogRef.close()
              })
        }
      })
  }

  ngOnDestroy(): void {
    this.removeUserForm.reset()
  }
}
