import {Component, inject} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UsersService} from "../../../../../services/users.service";
import {GroupsService} from "../../../../../services/groups.service";
import {NgToastService} from "ng-angular-popup";
import {ChangeRoleRequest} from "../../../../../data-transferring/contracts/group/change-role-request";
import {GroupDataService} from "../../../../../states/group-data.service";
import {catchError, finalize, take, throwError} from "rxjs";
import {ApplicationHubService} from "../../../../../services/application-hub.service";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/autocomplete";
import {MatSelect} from "@angular/material/select";
import {CustomPopUpForm} from "../../../../../custom/interfaces/CustomPopUpForm";
import {NgIf} from "@angular/common";

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
  readonly dialogRef = inject(MatDialogRef<ChangeRoleComponent>)
  isLoading!: boolean
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

  onSubmit() {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    this.changeRoleForm.disable()
    this.isLoading = true

    const addUserRequest : ChangeRoleRequest = {
      userId : userId,
      groupId : groupId,
      userName : this.changeRoleForm.get('userName')!.value,
      role : +this.changeRoleForm.get('userRole')!.value
    }

    this.groupService.changeRole(addUserRequest)
      .pipe(
        take(1),
        catchError(error => {
          return throwError(() => error)
        }),
        finalize(() => {
          this.changeRoleForm.enable()
          this.isLoading = false
        })
      )
      .subscribe({
        next : (res) => {
          this.applicationHubService.changeRole(addUserRequest.userName, addUserRequest.role, addUserRequest.groupId)
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
