import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {AuthorisationService} from "../services/authorisation.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  logInError:string = ''
  constructor(private router: Router, private auth : AuthorisationService) { }

  onLogin(username: string, password: string){
      this.auth.logIn(username.trim(), password.trim()).subscribe(
        {
          next: res =>{
            console.log(res.message)
            this.auth.storeUsername(username)
            this.auth.storeToken(res.token)
            this.router.navigate(['/main']);
          },
          error: err => {
            console.log(err.error.message)
            this.logInError = err.error.message;
          }
        }
      );
  }

  goToRegistration() : void {
    this.router.navigate(['registration']);
  }
}
