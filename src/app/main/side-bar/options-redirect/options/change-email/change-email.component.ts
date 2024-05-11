import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {UserService} from "../../../../../services/user.service";

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
  constructor(private auth : UserService) {

  }

  onChangeEmail(email: string){
    this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
      this.auth.changeEmail(email, userID).subscribe({
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
