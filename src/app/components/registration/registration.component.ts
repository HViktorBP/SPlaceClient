import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UsersService} from "../../services/users.service";
import {NgIf} from "@angular/common";
import {NgToastService} from "ng-angular-popup";
import {catchError, finalize, throwError} from "rxjs";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {UserRegistrationRequest} from "../../data-transferring/contracts/user/user-registration-request";

/**
 * RegistrationComponent is responsible for registering user into the application.
 */
@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardSubtitle,
    MatCardTitle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    MatIcon,
    MatIconButton,
    MatSuffix
  ],
  templateUrl: './registration.component.html',
  styleUrl: '../../custom/styles/authorization-form.scss'
})

export class RegistrationComponent implements OnInit, OnDestroy {
  /**
   * Description : Registration form
   */
  registrationForm!: FormGroup;

  /**
   * Description: Bool signal. that indicates whether the password should be visible or not.
   */
  hide = signal(true);

  constructor(private router: Router,
              private auth : UsersService,
              private toast : NgToastService,
              private fb : FormBuilder) { }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(35)]],
      confirmedPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(35)]],
    });
  }

  /**
   * Description: onRegister is a function that handles the logic behind registering process, including handling UI and calling HTTP.
   * @memberof RegistrationComponent
   */
  onRegister() {
    if (this.registrationForm.valid) {
      if (this.registrationForm.get('confirmedPassword')?.value == this.registrationForm.get('password')?.value) {
        this.registrationForm.disable()

        const registrationData : UserRegistrationRequest = {
          username : this.registrationForm.get('username')?.value,
          password: this.registrationForm.get('password')?.value,
          email : this.registrationForm.get('email')?.value
        }

        this.auth.signUp(registrationData)
          .pipe(
            catchError(error => {
              return throwError(() => error)
            }),
            finalize(() => this.registrationForm.enable())
          )
          .subscribe({
            next: res => {
              this.toast.success({detail: "Success", summary: res.message, duration: 3000})
              this.router.navigate(['login'])
            }
          })
      } else {
        this.toast.error({detail: "Error", summary: "Passwords are not matching!", duration: 3000})
      }
    } else {
      this.toast.warning({detail: "Warning", summary: "Please fill out the form correctly.", duration: 3000});
    }
  }

  /**
   * Description : goToLogin method navigates user to log in page.
   * @memberof RegistrationComponent
   */
  goToLogin() : void {
    this.router.navigate(['login'])
  }

  /**
   * Description : togglePassword method switches the visibility of password.
   * @param {MouseEvent} event
   * @memberOf RegistrationComponent
   */
  togglePassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  ngOnDestroy() {
    this.registrationForm.reset()
  }
}
