import {Component, inject} from '@angular/core';
import {UsersService} from "../../../../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ChangeUsernameRequest} from "../../../../data-transferring/contracts/user/change-username-request";
import {catchError, finalize, tap, throwError} from "rxjs";
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
import {UserDataService} from "../../../../services/states/user-data.service";

/**
 * ChangeUsernameComponent provides UI for user to change the username.
 */

@Component({
    selector: 'app-change-username',
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
  /**
   * Description: Reference to the component that will be opened in dialog.
   */
  readonly dialogRef = inject(MatDialogRef<ChangeUsernameComponent>)

  /**
   * Description: form for new name.
   */
  newUserNameForm!: FormGroup

  constructor(private toast : NgToastService,
              private applicationHubService : ApplicationHubService,
              private userService : UsersService,
              private userDataService : UserDataService,
              private fb : FormBuilder) { }

  ngOnInit(): void {
    this.newUserNameForm = this.fb.group({
      newUsername: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
    })
  }

  /**
   * Description: onSubmit method calls a function that sends an HTTP request for changing a user's username and handles the UI according to the request's response.
   * If the operation successful, the status changing is also broadcast to the groups where user participates by calling an applicationHub's changeName method.
   * @see ApplicationHubService
   */
  onSubmit() {
    const userId = this.userService.getUserId()

    this.newUserNameForm.disable()

    const changeUsernameRequest : ChangeUsernameRequest = {
      userId : userId,
      newUsername : this.newUserNameForm.get('newUsername')?.value
    }

    this.userService.changeUsername(changeUsernameRequest)
      .pipe(
        tap(() => {
          this.userService.getUserAccount(this.userService.getUserId())
            .pipe(
              catchError(error => {
                return throwError(() => error)
              })
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
        })
      )
      .subscribe({
        next : res => {
          this.applicationHubService
            .changeName(changeUsernameRequest.newUsername)
            .then(
              () => {
                this.toast.success({detail:"Success", summary: res.message, duration:3000})
                this.userService.storeUserData(res.token)
                this.dialogRef.close()
              }
            )
        }
      })
  }

  ngOnDestroy(): void {
    this.newUserNameForm.reset()
  }
}
