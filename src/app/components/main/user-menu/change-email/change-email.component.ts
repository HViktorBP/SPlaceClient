import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {NgToastService} from "ng-angular-popup";
import {UsersService} from "../../../../services/users.service";
import {catchError, finalize, throwError} from "rxjs";
import {CustomPopUpForm} from "../../../../custom/interfaces/CustomPopUpForm";
import {ChangeEmailRequest} from "../../../../data-transferring/contracts/user/change-email-request";

@Component({
    selector: 'app-change-email',
    imports: [
        FormsModule,
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
        MatError,
        MatFormField,
        MatInput,
        MatLabel,
        NgIf,
        ReactiveFormsModule
    ],
    templateUrl: './change-email.component.html',
    styleUrl: './change-email.component.scss'
})
export class ChangeEmailComponent implements CustomPopUpForm {
  /**
   * Description: Reference to the component that will be opened in dialog.
   */
  readonly dialogRef = inject(MatDialogRef<ChangeEmailComponent>)

  /**
   * Description: form for new password.
   */
  newEmailForm!: FormGroup

  constructor(private toast : NgToastService,
              private userService : UsersService,
              private fb : FormBuilder) { }

  ngOnInit() {
    this.newEmailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
    })
  }

  /**
   * Description: onSubmit method calls a function that sends an HTTP request for changing a user's password and handles the UI according to the request's response.
   */
  onSubmit() {
    const userId = this.userService.getUserId()

    this.newEmailForm.disable()

    const changeEmailRequest : ChangeEmailRequest = {
      userId : userId,
      newEmail : this.newEmailForm.get('newEmail')!.value
    }

    this.userService.changeEmail(changeEmailRequest)
      .pipe(
        catchError(error => {
          return throwError(() => error)
        }),
        finalize(() => {
          this.newEmailForm.enable()
        })
      )
      .subscribe({
        next : res => {
          this.toast.success({detail:"Success", summary: res.message, duration:3000})
          this.dialogRef.close()
        }
      })
  }

  ngOnDestroy() {
    this.newEmailForm.reset()
  }
}
