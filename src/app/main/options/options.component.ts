import {Component} from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";
import {ChangeUsernameComponent} from "./change-username/change-username.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ChangeStatusComponent} from "./change-status/change-status.component";
import {AboutAppComponent} from "./about-app/about-app.component";
import {DeleteAccountComponent} from "./delete-account/delete-account.component";

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    ChangeUsernameComponent,
    ChangePasswordComponent,
    ChangeStatusComponent,
    AboutAppComponent,
    DeleteAccountComponent
  ],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss'
})
export class OptionsComponent {

}
