import {Component, inject} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UsersService} from "../../../../../../services/users.service";
import {GroupsService} from "../../../../../../services/groups.service";
import {NgToastService} from "ng-angular-popup";
import {ChangeRoleRequest} from "../../../../../../data-transferring/contracts/group/change-role-request";
import {GroupDataService} from "../../../../../../services/states/group-data.service";
import {catchError, finalize, throwError} from "rxjs";
import {ApplicationHubService} from "../../../../../../services/application-hub.service";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {CustomPopUpForm} from "../../../../../../custom/interfaces/CustomPopUpForm";
import {NgIf} from "@angular/common";

/**
 * ChangeRoleComponent provides UI for changing user's role in the group.
 */
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
    MatSelect,
    MatError,
    NgIf
  ],
  templateUrl: './change-role.component.html',
  styleUrl: './change-role.component.scss'
})

export class ChangeRoleComponent implements CustomPopUpForm {
  /**
   * Description: MatDialog reference to ChangeRoleComponent
   */
  readonly dialogRef = inject(MatDialogRef<ChangeRoleComponent>)

  /**
   * Description: Form for changing user's role
   */
  changeRoleForm!: FormGroup

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private applicationHubService : ApplicationHubService,
              private toast : NgToastService,
              private groupDataService : GroupDataService,
              private fb : FormBuilder) {
  }

  ngOnInit(): void {
    this.changeRoleForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      userRole : [3, [Validators.required, Validators.min(1), Validators.max(3)]],
    })
  }

  /**
   * Description: onSubmit method calls a function that sends an HTTP request for changing a user and handles the UI according to the request's response.
   * If the operation successful, it updates the UI for all other users who participate in group and also informs user about his role being changed by calling an applicationHub's changeRole method.
   * @see ApplicationHubService
   */
  onSubmit() {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    this.changeRoleForm.disable()

    const addUserRequest : ChangeRoleRequest = {
      userId : userId,
      groupId : groupId,
      userName : this.changeRoleForm.get('userName')!.value,
      role : +this.changeRoleForm.get('userRole')!.value
    }

    this.groupService.changeRole(addUserRequest)
      .pipe(
        catchError(error => {
          return throwError(() => error)
        }),
        finalize(() => {
          this.changeRoleForm.enable()
        })
      )
      .subscribe({
        next : (res) => {
          this.applicationHubService
            .changeRole(addUserRequest.userName, addUserRequest.role, addUserRequest.groupId)
            .then(() => {
              this.toast.success({detail:"Success", summary: res.message, duration:3000})
              this.dialogRef.close()
            })
        }
      })
  }

  ngOnDestroy(): void {
    this.changeRoleForm.reset()
  }
}
