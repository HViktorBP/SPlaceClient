import { Component } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {UserDataChange} from "../../../dtos/user/user-data-change";

@Component({
  selector: 'app-change-username',
  standalone: true,
  imports: [],
  templateUrl: './change-username.component.html',
  styleUrl: './change-username.component.scss'
})
export class ChangeUsernameComponent {
  newUsername!: string;

  constructor(private userService : UserService) { }

  onClick() {
    let userId = this.userService.getUserId();

    let dataToChange : UserDataChange = {userId: userId, dataToChange: this.newUsername};

    this.userService.changeUsername(dataToChange)
  }
}
