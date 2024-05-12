import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {UserService} from "../../../../../services/user.service";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-change-email',
  standalone: true,
    imports: [
        FormsModule
    ],
  templateUrl: './change-email.component.html',
  styleUrl: '../../../../../../customStyles/options-custom.scss'
})
export class ChangeEmailComponent {
  constructor(private auth : UserService,
              private toast : NgToastService) {

  }

  onChangeEmail(email: string){
    this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
      this.auth.changeEmail(email, userID).subscribe({
        next: res => {
          this.toast.success({detail:"Success", summary:res.message, duration:3000})
        },
        error: err => {
          this.toast.error({detail:"Error", summary:err.error.message, duration:3000})
        }
      })
    })
  }
}
