import {Component, inject} from '@angular/core';
import {LogOutComponent} from "./log-out/log-out.component";
import {UserDataService} from "../../../services/states/user-data.service";
import {AsyncPipe} from "@angular/common";
import {MatMenu, MatMenuTrigger} from "@angular/material/menu";
import {MatButton} from "@angular/material/button";
import {AboutAppComponent} from "../about-app/about-app.component";
import {ChangeUsernameComponent} from "./change-username/change-username.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ChangeStatusComponent} from "./change-status/change-status.component";
import {DeleteAccountComponent} from "./delete-account/delete-account.component";
import {MatDivider} from "@angular/material/divider";
import {MatDialog} from "@angular/material/dialog";
import {ChangeEmailComponent} from "./change-email/change-email.component";

/**
 * UserMenuComponent represents a user's menu.
 */

@Component({
    selector: 'app-user-menu',
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
  /**
   * Description: opens the MatDialog
   */
  readonly dialog = inject(MatDialog)

  constructor(public userDataService : UserDataService) { }

  /**
   * Description: opens the ChangeUsernameComponent in MatDialog
   */
  openChangeUsername() {
    this.dialog.open(ChangeUsernameComponent)
  }

  openChangeEmail() {
    this.dialog.open(ChangeEmailComponent)
  }

  /**
   * Description: opens the ChangePasswordComponent in MatDialog
   */
  openChangePassword() {
    this.dialog.open(ChangePasswordComponent)
  }

  /**
   * Description: opens the ChangeStatusComponent in MatDialog
   */
  openChangeStatus() {
    this.dialog.open(ChangeStatusComponent)
  }

  /**
   * Description: opens the LogOutComponent in MatDialog
   */
  openLogOut() {
    this.dialog.open(LogOutComponent)
  }

  /**
   * Description: opens the AboutAppComponent in MatDialog
   */
  openAboutApp() {
  this.dialog.open(AboutAppComponent)
  }

  /**
   * Description: opens the DeleteAccountComponent in MatDialog
   */
  openDeleteAccount() {
    this.dialog.open(DeleteAccountComponent)
  }
}
