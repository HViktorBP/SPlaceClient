import {Component, inject} from '@angular/core';
import {NgIf, NgOptimizedImage} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GroupsService} from "../../../../../services/groups.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UsersService} from "../../../../../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {AddUserRequest} from "../../../../../data-transferring/contracts/group/add-user-request";
import {GroupDataService} from "../../../../../states/group-data.service";
import {catchError, finalize, take, throwError} from "rxjs";
import {ApplicationHubService} from "../../../../../services/application-hub.service";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {CustomPopUpForm} from "../../../../../custom/interfaces/CustomPopUpForm";

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
  readonly dialogRef = inject(MatDialogRef<AddUserComponent>)
  isLoading!: boolean
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

  onSubmit() {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    this.addUserForm.disable()
    this.isLoading = true

    const addUserRequest : AddUserRequest = {
      userId : userId,
      groupId : groupId,
      userToAddName : this.addUserForm.get('userName')!.value,
      role : +this.addUserForm.get('userRole')!.value
    }

    this.groupService.addUser(addUserRequest)
      .pipe(
        take(1),
        catchError(error => {
          return throwError(() => error)
        }),
        finalize(() => {
          this.addUserForm.enable()
          this.isLoading = false
        }))
      .subscribe({
        next : res => {
          this.applicationHubService.addToGroup(addUserRequest.groupId, addUserRequest.userToAddName)
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
