import {Component, OnInit} from '@angular/core';
import {ChangeUsernameComponent} from "./change-username/change-username.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ChangeStatusComponent} from "./change-status/change-status.component";
import {AboutAppComponent} from "./about-app/about-app.component";
import {ChangeEmailComponent} from "./change-email/change-email.component";
import {UsersDataService} from "../../../../services/users-data.service";

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [
    ChangeUsernameComponent,
    ChangePasswordComponent,
    ChangeStatusComponent,
    AboutAppComponent,
    ChangeEmailComponent
  ],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent implements OnInit{

  constructor(
    private userData : UsersDataService
  ) {
  }

  ngOnInit() {
    this.userData.updateGroupId(0)
    this.userData.updateUserRole('')
  }
}
