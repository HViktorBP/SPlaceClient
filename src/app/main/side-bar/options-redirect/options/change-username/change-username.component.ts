import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {UserService} from "../../../../../services/user.service";
import {UsersDataService} from "../../../../../services/users-data.service";
import {NgToastService} from "ng-angular-popup";

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
  constructor(private auth : UserService,
              private userService : UsersDataService,
              private toast : NgToastService) {

  }

  onChangeUsername(username: string){
    this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
      this.auth.changeUsername(username, userID).subscribe({
        next: res => {
          this.toast.success({detail:"Success", summary:res.message, duration:3000})
          this.userService.updateUsername(username)
          this.auth.storeUsername(username)
        },
        error: err => {
          this.toast.error({detail:"Error", summary:err.error.message, duration:3000})
        }
      })
    })
  }
}
