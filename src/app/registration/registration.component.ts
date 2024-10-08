import {Component, OnDestroy} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {NgIf} from "@angular/common";
import {NgToastService} from "ng-angular-popup";
import {Subscription} from "rxjs";
import {User} from "../interfaces/user";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})

export class RegistrationComponent implements OnDestroy {
  user : any = {
    username : '',
    password : '',
  }
  registration !: Subscription;

  constructor(private router: Router,
              private auth : UserService,
              private toast : NgToastService) { }

  register(passwordCheck:string) {
    if (passwordCheck == this.user.password) {
      this.registration = this.auth.signUp(this.user).subscribe(
        {
          next: res => {
            this.toast.success({detail: "Success", summary: res.message, duration: 3000})
            this.router.navigate(['login'])
          },
          error: err => {
            this.toast.error({detail: "Error", summary: err.message, duration: 3000})
          }
        }
      )
    } else {
      this.toast.error({detail: "Error", summary: "Passwords are not matching!", duration: 3000})
    }
  }

  goToLogin() : void {
    this.router.navigate(['login'])
  }

  ngOnDestroy() {
    this.registration.unsubscribe()
  }
}
