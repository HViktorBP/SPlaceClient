import {Component} from '@angular/core';
import {UsersService} from "../../../services/users.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PopUpService} from "../../../services/pop-up.service";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-delete-account',
  standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss'
})
export class DeleteAccountComponent {

  constructor(private popUpService : PopUpService,
              private toast : NgToastService,
              private userService : UsersService) { }

  open(content: any) {
    this.popUpService.openModal(content).then(
      () => {
        this.onSubmit();
      },
      (reason) => {
        console.log(`Dismissed ${this.popUpService.getDismissReason(reason)}`);
      }
    );
  }

  onSubmit() {
    const deleteAccountSubscription = this.userService.deleteAccount().subscribe({
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
