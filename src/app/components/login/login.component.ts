import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UsersService} from "../../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {catchError, finalize, take, throwError} from "rxjs";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatHint, MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {NgIf} from "@angular/common";
import {UserLogInRequest} from "../../data-transferring/contracts/user/user-log-in-request";

/**
 * LoginComponent is responsible for handling the logging in into the application.
 */
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
    MatCard,
    MatCardTitle,
    MatCardContent,
    ReactiveFormsModule,
    NgIf,
    MatButton,
    MatError,
    MatCardHeader,
    MatCardSubtitle
  ],
  templateUrl: './login.component.html',
  styleUrl: '../../custom/styles/authorization-form.scss'
})

export class LoginComponent implements OnInit, OnDestroy{
  /**
   * Description: Log in form.
   */
  loginForm!: FormGroup

  /**
   * Description: Bool signal. that indicates whether the password should be visible or not.
   */
  hide = signal(true)

  constructor(private router: Router,
              private userService: UsersService,
              private toast: NgToastService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(25)]]
    })
  }

  /**
   * Description: onLogin is a function that handles the logic behind logging in process, including handling UI, calling HTTP method and storing the user data in case of success.
   * @memberof LoginComponent
   */
  onLogin() : void {
    if (this.loginForm.valid) {
      this.loginForm.disable()

      const loginData : UserLogInRequest = {
        username : this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      }

      this.userService.logIn(loginData)
        .pipe(
          take(1),
          catchError(error => {
            return throwError(() => error)
          }),
          finalize(() => this.loginForm.enable())
        )
        .subscribe({
            next: res => {
              this.toast.success({detail: "Success", summary: res.message, duration: 3000})
              this.userService.storeUserData(res.token)
              this.router.navigate(['main'])
            }
          })
    } else {
      this.toast.warning({detail: "Warning", summary: "Please fill out the form correctly.", duration: 3000})
    }
  }

  /**
   * Description : goToRegistration method navigates user to registration page.
   * @memberof LoginComponent
   */
  goToRegistration(): void {
    this.router.navigate(['registration'])
  }

  /**
   * Description : togglePassword method switches the visibility of password.
   * @param {MouseEvent} event
   * @memberOf LoginComponent
   */
  togglePassword(event: MouseEvent) {
    this.hide.set(!this.hide())
    event.stopPropagation()
  }

  ngOnDestroy() {
    this.loginForm.reset()
  }
}
