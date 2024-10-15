import {Component} from '@angular/core';
import {UsersService} from "../../../services/users.service";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {PopUpService} from "../../../services/pop-up.service";
import {NgToastService} from "ng-angular-popup";
import {ChangePasswordRequest} from "../../../contracts/user/change-password-request";
import {take} from "rxjs";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})

export class ChangePasswordComponent {
  constructor(private popUpService : PopUpService,
              private toast : NgToastService,
              private userService : UsersService) { }

  open(content: any) {
    this.popUpService.openModal(content).then(
      (result) => {
        this.onSubmit(result);
      },
      (reason) => {
        console.log(`Dismissed ${this.popUpService.getDismissReason(reason)}`);
      }
    );
  }

  onSubmit(form : NgForm) {
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
          this.popUpService.dismissThePopup()
        },
        error : err => {
          this.toast.error({detail:"Error", summary: err, duration:3000})
        }
      })
  }
}
