import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthorisationService} from "../services/authorisation.service";
import {NgIf} from "@angular/common";

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
  registerError : string = ''
  constructor(private router: Router,  private auth : AuthorisationService) { }
  register(username:string, password:string, email:string, passwordCheck:string) {
    if (passwordCheck.trim() == password.trim()) {
      this.auth.signUp(username.trim(), password.trim(), email).subscribe(
        {
          next: res =>{
            console.log(res.message)
            this.auth.storeUsername(username.trim())
            this.router.navigate(['/main/home'])
          },
          error: err => {
            console.log(err.error.message)
            this.registerError = err.error.message;
          }
        }
      );
    } else {
      this.registerError = 'Passwords are not matching!';
    }

  }

  goToLogin() : void {
    this.router.navigate(['login']);
  }
}
