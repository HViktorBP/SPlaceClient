import {Component, inject} from '@angular/core';
import {UsersService} from "../../../services/users.service";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {ChangePasswordRequest} from "../../../data-transferring/contracts/user/change-password-request";
import {take} from "rxjs";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

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
    MatLabel
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})

export class ChangePasswordComponent {
  readonly dialogRef = inject(MatDialogRef<ChangePasswordComponent>);
  constructor(private toast : NgToastService,
              private userService : UsersService) { }

  onSubmit(form : NgForm) {

    if (form.value.newPassword != form.value.submitNewPassword) {
      const userId = this.userService.getUserId()

      const changePasswordRequest : ChangePasswordRequest = {
        userId : userId,
        newPassword : form.value.newPassword
      }

      this.userService.changePassword(changePasswordRequest)
        .pipe(take(1))
        .subscribe({
          next : res => {
            this.toast.success({detail:"Info", summary: res, duration:3000})
            this.dialogRef.close()
          },
          error : err => {
            this.toast.error({detail:"Error", summary: err, duration:3000})
          }
        })
    }
  }
}
