import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {UserService} from "../../../../../services/user.service";

@Component({
  selector: 'app-change-password',
  standalone: true,
    imports: [
        FormsModule
    ],
  templateUrl: './change-password.component.html',
  styleUrl: '../../../../../../customStyles/options-custom.scss'
})
export class ChangePasswordComponent {
  constructor(private auth : UserService) {

  }

  onChangePassword(password: string){
    this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
      this.auth.changePassword(password, userID).subscribe({
        next: res => {
          console.log(res.message)
        },
        error: err=> {
          console.log(err.error.message)
        }
      })
    })
  }
}
