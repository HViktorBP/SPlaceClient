import { Component } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {UserDataChange} from "../../../dtos/user/user-data-change";

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  newPassword!: string;

  constructor(private userService : UserService) { }

  onClick() {
    let userId = this.userService.getUserId();

    let dataToChange : UserDataChange = {userId: userId, dataToChange: this.newPassword};

    this.userService.changePassword(dataToChange)
  }
}
