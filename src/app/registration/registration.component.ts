import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {UsersService} from "../services/users.service";
import {NgIf} from "@angular/common";
import {NgToastService} from "ng-angular-popup";
import {finalize, take} from "rxjs";
import {MatButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

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
    MatLabel
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})

export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm!: FormGroup;

  constructor(private router: Router,
              private auth : UsersService,
              private toast : NgToastService,
              private fb : FormBuilder) { }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmedPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onRegister() {
    if (this.registrationForm.valid) {
      if (this.registrationForm.get('confirmedPassword')?.value == this.registrationForm.get('password')?.value) {
        this.auth.signUp(this.registrationForm.value)
          .pipe(
            take(1),
            finalize(() => this.registrationForm.enable())
          )
          .subscribe({
              next: res => {
                this.toast.success({detail: "Success", summary: res.message, duration: 3000})
                this.router.navigate(['login'])
              },
              error: err => {
                this.toast.error({detail: "Error", summary: err.message, duration: 3000})
              }
            })

        this.registrationForm.disable()

      } else {
        this.toast.error({detail: "Error", summary: "Passwords are not matching!", duration: 3000})
      }
    } else {
      this.toast.warning({detail: "Warning", summary: "Please fill out the form correctly.", duration: 3000});
    }
  }

  goToLogin() : void {
    this.router.navigate(['login'])
  }

  ngOnDestroy() {
    this.registrationForm.reset()
  }
}
