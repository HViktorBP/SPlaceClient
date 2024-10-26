import {Component, inject} from '@angular/core';
import {UsersService} from "../../../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {ChangeUsernameRequest} from "../../../contracts/user/change-username-request";
import {take} from "rxjs";
import {ApplicationHubService} from "../../../services/application-hub.service";
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";

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
    MatLabel
  ],
  templateUrl: './change-username.component.html',
  styleUrl: './change-username.component.scss'
})
export class ChangeUsernameComponent {
  readonly dialogRef = inject(MatDialogRef<ChangeUsernameComponent>);

  constructor(private toast : NgToastService,
              private applicationHubService : ApplicationHubService,
              private userService : UsersService) { }

  onSubmit(form : NgForm) {
    const userId = this.userService.getUserId()

    const changeUsernameRequest : ChangeUsernameRequest = {
      userId : userId,
      newUsername : form.value.newUsername
    }

    this.userService.changeUsername(changeUsernameRequest)
      .pipe(take(1))
      .subscribe({
        next : res => {
          this.applicationHubService.changeName(changeUsernameRequest.newUsername)
            .then(
              () => {
                this.toast.info({detail:"Info", summary: res.message, duration:3000})
                this.dialogRef.close();
              }
            )
            .catch(error => {
              this.toast.error({detail:"Error", summary: error, duration:3000})
            })
          this.userService.storeUserData(res.token)
        },
        error : err => {
          this.toast.error({detail:"Error", summary: err, duration:3000})
        }
      })

  }
}
