import { Component } from '@angular/core';
import {UserService} from "../../../services/user.service";
import {UserDataChange} from "../../../dtos/user/user-data-change";

@Component({
  selector: 'app-change-status',
  standalone: true,
  imports: [],
  templateUrl: './change-status.component.html',
  styleUrl: './change-status.component.scss'
})
export class ChangeStatusComponent {
  newStatus!: string;

  constructor(private userService : UserService) { }

  onClick() {
    let userId = this.userService.getUserId();

    let dataToChange : UserDataChange = {userId: userId, dataToChange: this.newStatus};

    this.userService.changeStatus(dataToChange)
  }
}
