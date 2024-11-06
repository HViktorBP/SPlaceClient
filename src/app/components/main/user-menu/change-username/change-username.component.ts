import {Component, inject} from '@angular/core';
import {UsersService} from "../../../../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {ChangeUsernameRequest} from "../../../../data-transferring/contracts/user/change-username-request";
import {catchError, finalize, take, tap, throwError} from "rxjs";
import {ApplicationHubService} from "../../../../services/application-hub.service";
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {CustomPopUpForm} from "../../../../custom/interfaces/CustomPopUpForm";
import {NgIf} from "@angular/common";
import {UsersDataService} from "../../../../services/states/users-data.service";

@Component({
  selector: 'app-change-username',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatDialogContent,
    MatFormField,
    MatDialogActions,
    MatButton,
    MatDialogTitle,
    MatInput,
    MatDialogClose,
    MatLabel,
    MatError,
    NgIf
  ],
  templateUrl: './change-username.component.html',
  styleUrl: './change-username.component.scss'
})
export class ChangeUsernameComponent implements CustomPopUpForm {
  readonly dialogRef = inject(MatDialogRef<ChangeUsernameComponent>)
  newUserNameForm!: FormGroup
  isLoading!: boolean

  constructor(private toast : NgToastService,
              private applicationHubService : ApplicationHubService,
              private userService : UsersService,
              private userDataService : UsersDataService,
              private fb : FormBuilder) { }

  ngOnInit(): void {
    this.newUserNameForm = this.fb.group({
      newUsername: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
    })
  }

  onSubmit() {
    const userId = this.userService.getUserId()

    this.isLoading = true
    this.newUserNameForm.disable()

    const changeUsernameRequest : ChangeUsernameRequest = {
      userId : userId,
      newUsername : this.newUserNameForm.get('newUsername')?.value
    }

    this.userService.changeUsername(changeUsernameRequest)
      .pipe(
        take(1),
        tap(() => {
          this.userService.getUserAccount(this.userService.getUserId())
            .pipe(
              take(1),
            ).subscribe({
              next : account => {
                this.userDataService.updateUsername(account.username)
              }
          })
        }),
        catchError(error => {
          return throwError(() => error)
        }),
        finalize(() => {
          this.newUserNameForm.enable()
          this.isLoading = false
        })
      )
      .subscribe({
        next : res => {
          this.applicationHubService.changeName(changeUsernameRequest.newUsername)
            .then(
              () => {
                this.toast.success({detail:"Info", summary: res.message, duration:3000})
                this.userService.storeUserData(res.token)
                this.dialogRef.close();
              }
            )
        }
      })
  }

  ngOnDestroy(): void {
    this.newUserNameForm.reset()
  }
}
