import {Component, inject} from '@angular/core';
import {LogOutComponent} from "./log-out/log-out.component";
import {UsersDataService} from "../../states/users-data.service";
import {AsyncPipe} from "@angular/common";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatButton} from "@angular/material/button";
import {AboutAppComponent} from "./about-app/about-app.component";
import {ChangeUsernameComponent} from "./change-username/change-username.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ChangeStatusComponent} from "./change-status/change-status.component";
import {DeleteAccountComponent} from "./delete-account/delete-account.component";
import {MatDivider} from "@angular/material/divider";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    LogOutComponent,
    AsyncPipe,
    MatMenuTrigger,
    MatMenu,
    MatButton,
    AboutAppComponent,
    ChangeUsernameComponent,
    ChangePasswordComponent,
    ChangeStatusComponent,
    DeleteAccountComponent,
    MatDivider,
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.scss'
})
export class UserMenuComponent {
  readonly dialog = inject(MatDialog);

  constructor(public userDataService : UsersDataService) {
  }

  openChangeUsername() {
    this.dialog.open(ChangeUsernameComponent)
  }

  openChangePassword() {
    this.dialog.open(ChangePasswordComponent)
  }

  openChangeStatus() {
    this.dialog.open(ChangeStatusComponent)
  }

  openLogOut() {
    this.dialog.open(LogOutComponent)

  }

  openAboutApp() {
  this.dialog.open(AboutAppComponent)
  }

  openDeleteAccount() {
    this.dialog.open(DeleteAccountComponent)
  }
}
