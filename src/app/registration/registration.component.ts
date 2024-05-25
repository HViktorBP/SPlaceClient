import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {UserService} from "../services/user.service";
import {NgIf} from "@angular/common";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  constructor(private router: Router,
              private auth : UserService,
              private toast : NgToastService) { }
  register(username:string, password:string, email:string, passwordCheck:string) {
    if (passwordCheck == password) {
      this.auth.signUp(username, password, email).subscribe(
        {
          next: res =>{
            this.toast.success({detail: "Success", summary: res.message, duration: 3000})
            this.auth.storeUsername(username.trim())
            this.auth.storeToken(res.token)
            this.router.navigate(['/main/home'])
          },
          error: err => {
            this.toast.error({detail: "Error", summary: err.error.message, duration: 3000})
          }
        }
      );
    } else {
      this.toast.error({detail: "Error", summary: "Passwords are not matching!", duration: 3000})
    }
  }

  goToLogin() : void {
    this.router.navigate(['login']);
  }
}
