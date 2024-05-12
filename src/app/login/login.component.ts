import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {UserService} from "../services/user.service";
import {NgIf} from "@angular/common";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
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
}
