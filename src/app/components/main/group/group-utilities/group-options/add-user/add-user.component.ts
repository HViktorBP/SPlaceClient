import {Component, inject} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GroupsService} from "../../../../../../services/groups.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UsersService} from "../../../../../../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {AddUserRequest} from "../../../../../../data-transferring/contracts/group/add-user-request";
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
 * AddUserComponent provides UI for adding a user to the group.
 */
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
    MatOption,
    ReactiveFormsModule,
    MatError,
    NgIf
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent implements CustomPopUpForm {
  /**
   * Description: MatDialog reference to AddUserComponent
   */
  readonly dialogRef = inject(MatDialogRef<AddUserComponent>)

  /**
   * Description: Form for adding the user
   */
  addUserForm!: FormGroup

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private groupDataService : GroupDataService,
              private toast : NgToastService,
              private applicationHubService : ApplicationHubService,
              private fb : FormBuilder) {
  }

  ngOnInit(): void {
    this.addUserForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      userRole : [3, [Validators.required, Validators.min(1), Validators.max(3)]],
    })
  }

  /**
   * Description: onSubmit method calls a function that sends an HTTP request for adding a user and handles the UI according to the request's response.
   * If the operation successful, it updates the UI for all other users who participate in group and also informs the user who was added by calling an applicationHub's addUserRequest method.
   * @see ApplicationHubService
   */
  onSubmit() {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    this.addUserForm.disable()

    const addUserRequest : AddUserRequest = {
      userId : userId,
      groupId : groupId,
      userToAddName : this.addUserForm.get('userName')!.value,
      role : +this.addUserForm.get('userRole')!.value
    }

    this.groupService.addUser(addUserRequest)
      .pipe(
        catchError(error => {
          return throwError(() => error)
        }),
        finalize(() => {
          this.addUserForm.enable()
        }))
      .subscribe({
        next : res => {
          this.applicationHubService
            .addToGroup(addUserRequest.groupId, addUserRequest.userToAddName)
            .then(() => {
                this.toast.success({detail:"Success", summary: res.message, duration:3000})
              })
          this.dialogRef.close()
        }
      })
  }

  ngOnDestroy(): void {
    this.addUserForm.reset()
  }
}
