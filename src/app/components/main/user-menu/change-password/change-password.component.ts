import {Component, inject} from '@angular/core';
import {UsersService} from "../../../../services/users.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {ChangePasswordRequest} from "../../../../data-transferring/contracts/user/change-password-request";
import {catchError, finalize, throwError} from "rxjs";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {CustomPopUpForm} from "../../../../custom/interfaces/CustomPopUpForm";

/**
 * ChangePasswordComponent provides UI for user to change the password.
 */

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatError,
    NgIf
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})

export class ChangePasswordComponent implements CustomPopUpForm {
  /**
   * Description: Reference to the component that will be opened in dialog.
   */
  readonly dialogRef = inject(MatDialogRef<ChangePasswordComponent>)

  /**
   * Description: form for new password.
   */
  newPasswordForm!: FormGroup

  constructor(private toast : NgToastService,
              private userService : UsersService,
              private fb : FormBuilder) { }

  ngOnInit() {
    this.newPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
      submitNewPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]],
    })
  }

  /**
   * Description: onSubmit method calls a function that sends an HTTP request for changing a user's password and handles the UI according to the request's response.
   */
  onSubmit() {
    if (this.newPasswordForm.get('newPassword')!.value == this.newPasswordForm.get('submitNewPassword')!.value) {
      const userId = this.userService.getUserId()

      this.newPasswordForm.disable()

      const changePasswordRequest : ChangePasswordRequest = {
        userId : userId,
        newPassword : this.newPasswordForm.get('newPassword')!.value
      }

      this.userService.changePassword(changePasswordRequest)
        .pipe(
          catchError(error => {
            return throwError(() => error)
          }),
          finalize(() => {
            this.newPasswordForm.enable()
          })
        )
        .subscribe({
          next : res => {
            this.toast.success({detail:"Success", summary: res.message, duration:3000})
            this.dialogRef.close()
          }
        })
    } else {
      this.toast.error({detail:"Info", summary: "Passwords doesn't match.", duration:3000})
    }
  }

  ngOnDestroy() {
    this.newPasswordForm.reset()
  }
}
