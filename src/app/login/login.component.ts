import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {UserService} from "../services/user.service";
import {NgIf} from "@angular/common";
import { IconDefinition, faE, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    FaIconComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  faEye : IconDefinition = faEye
  passwordVision : string = "password"

  constructor(private router: Router,
              private auth : UserService,
              private toast : NgToastService) { }

  onLogin(username: string, password: string){
    this.auth.logIn(username.trim(), password.trim()).subscribe(
      {
        next: res =>{
          this.toast.success({detail:"Success", summary: res.message, duration:3000})
          this.auth.storeUsername(username)
          this.auth.storeToken(res.token)
          this.router.navigate(['/main/home']);
        },
        error: err => {
          this.toast.error({detail:"Error", summary: err.error.message, duration:3000})
        }
      }
    );
  }

  goToRegistration() : void {
    this.router.navigate(['registration']);
  }

  toggleEye() : void {
    if (this.faEye == faEye) {
      this.faEye = faEyeSlash
      this.passwordVision = "text"
    } else{
      this.faEye = faEye
      this.passwordVision = "password"
    }
  }
}
