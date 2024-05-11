import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {UserService} from "../../../../../services/user.service";
import {UsersDataService} from "../../../../../services/users-data.service";

@Component({
  selector: 'app-change-username',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './change-username.component.html',
  styleUrl: '../../../../../../customStyles/options-custom.scss'
})
export class ChangeUsernameComponent {
  constructor(private auth : UserService, private userService : UsersDataService) {

  }

  onChangeUsername(username: string){
    this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
      this.auth.changeUsername(username, userID).subscribe({
        next: res => {
          console.log(res.message)
          this.userService.updateUsername(username)
          this.auth.storeUsername(username)
        },
        error: err=> {
          console.log(err.error.message)
        }
      })
    })
  }
}
