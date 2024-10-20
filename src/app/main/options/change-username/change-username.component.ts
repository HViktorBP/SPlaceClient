import {Component} from '@angular/core';
import {UsersService} from "../../../services/users.service";
import {PopUpService} from "../../../services/pop-up.service";
import {NgToastService} from "ng-angular-popup";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {ChangeUsernameRequest} from "../../../contracts/user/change-username-request";
import {take} from "rxjs";
import {ApplicationHubService} from "../../../services/application-hub.service";

@Component({
  selector: 'app-change-username',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './change-username.component.html',
  styleUrl: './change-username.component.scss'
})
export class ChangeUsernameComponent {

  constructor(private popUpService : PopUpService,
              private toast : NgToastService,
              private applicationHubService : ApplicationHubService,
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
                this.toast.info({detail:"Info", summary: 'Username changed successfully!', duration:3000})
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

    this.popUpService.dismissThePopup()
  }
}
