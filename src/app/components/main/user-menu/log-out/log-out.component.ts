import {Component, inject} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UsersService} from "../../../../services/users.service";
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";

/**
 * LogOutComponent provides UI for user to log out form the application.
 */

@Component({
    selector: 'app-log-out',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
    ],
    templateUrl: './log-out.component.html',
    styleUrl: './log-out.component.scss'
})

export class LogOutComponent {
  /**
   * Description: Reference to the component that will be opened in dialog.
   */
  readonly dialogRef = inject(MatDialogRef<LogOutComponent>)

  constructor(private userService : UsersService,
              private router : Router) { }

  /**
   * Description: onSubmit method calls a function that sends an HTTP request for logging out the user out of the application and handles the UI according to the request's response.
   */
  onSubmit() {
    this.userService.logOut()
    this.router
      .navigate(['/login'])
      .then(
        () => this.dialogRef.close()
      )
  }
}
