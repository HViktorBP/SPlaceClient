import {Component, OnDestroy, signal} from '@angular/core';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {UserService} from "../services/user.service";
import {NgToastService} from "ng-angular-popup";
import {Subscription} from "rxjs";
import {User} from "../interfaces/user";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatHint} from "@angular/material/input";
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {HoverDirective} from "../custom/directives/hover.directive";
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatHint,
    MatIconButton,
    MatIcon,
    MatLabel,
    MatSuffix,
    HoverDirective
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnDestroy{
  hide = signal(false);
  user : User = {
    username : '',
    password : '',
    status : '',
  }
  authorisation !: Subscription;

  constructor(private router: Router,
              private auth: UserService,
              private toast: NgToastService) {
  }

  onLogin() {
    this.authorisation = this.auth.logIn(this.user.username, this.user.password).subscribe(
      {
        next: res => {
          this.toast.success({detail: "Success", summary: res.message, duration: 3000})
          this.auth.storeUsername(this.user.username)
          this.auth.storeToken(res.token)
          this.router.navigate(['main'])
        },
        error: err => {
          this.toast.error({detail: "Error", summary: err.error.message, duration: 3000})
        }
      }
    )
  }

  goToRegistration(): void {
    this.router.navigate(['registration'])
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide)
    event.stopPropagation()
  }

  ngOnDestroy() {
    this.authorisation.unsubscribe()
  }
}
