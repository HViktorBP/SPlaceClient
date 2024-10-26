import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {UsersService} from "../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {finalize, take} from "rxjs";
import {MatError, MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatHint, MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {HoverDirective} from "../custom/directives/hover.directive";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {NgIf} from "@angular/common";

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
    HoverDirective,
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
  styleUrl: '../custom/styles/authorization-form.scss'
})

export class LoginComponent implements OnInit, OnDestroy{
  loginForm!: FormGroup;
  hide = signal(true);


  constructor(private router: Router,
              private userService: UsersService,
              private toast: NgToastService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.userService.logIn(this.loginForm.value)
        .pipe(
          take(1),
          finalize(() => this.loginForm.enable())
        )
        .subscribe(
          {
            next: res => {
              this.toast.success({detail: "Success", summary: res.message, duration: 3000});
              this.userService.storeUserData(res.token);
              this.router.navigate(['main']);
            },
            error: err => {
              this.toast.error({detail: "Error", summary: err.error.message, duration: 3000});
            }
          }
        );

      this.loginForm.disable();
    } else {
      this.toast.warning({detail: "Warning", summary: "Please fill out the form correctly.", duration: 3000});
    }
  }

  goToRegistration(): void {
    this.router.navigate(['registration'])
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  ngOnDestroy() {
    this.loginForm.reset()
  }
}
