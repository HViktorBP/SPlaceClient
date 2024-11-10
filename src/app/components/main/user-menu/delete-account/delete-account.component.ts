import {Component, inject, OnInit} from '@angular/core';
import {UsersService} from "../../../../services/users.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {catchError, finalize, take, throwError} from "rxjs";
import {ApplicationHubService} from "../../../../services/application-hub.service";
import {UsersDataService} from "../../../../services/states/users-data.service";
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";

/**
 * DeleteAccountComponent provides UI for user to delete his account.
 */

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss'
})

export class DeleteAccountComponent implements OnInit {
  /**
   * Description: Reference to the component that will be opened in dialog.
   */
  readonly dialogRef = inject(MatDialogRef<DeleteAccountComponent>)

  /**
   * Description: Displays whether HTTP request has been completed or not.
   */
  isLoading !: boolean

  constructor(private toast : NgToastService,
              private applicationHubService : ApplicationHubService,
              private usersDataService : UsersDataService,
              private userService : UsersService,
              private router : Router) { }

  ngOnInit() {
    this.isLoading = false
  }

  /**
   * Description: onSubmit method calls a function that sends an HTTP request for deleting a user's account and handles the UI according to the request's response.
   * If the operation successful, the status changing is also broadcast to the groups where user participates by calling an applicationHub's deleteUser method.
   * @see ApplicationHubService
   */
  onSubmit() {
    const groupToDelete = this.usersDataService.createdGroups.map(g => g.id)

    this.isLoading = true

    this.userService
      .deleteAccount()
      .pipe(
        take(1),
        catchError(err => {
          return throwError(() => err)
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next : res => {
          this.applicationHubService
            .deleteUser(groupToDelete)
            .then(() => {
                this.toast.info({detail:"Info", summary: res.message, duration:3000})
            })
            .finally(() => {
              this.router
                .navigate(['login'])
                .then(() => {
                  this.userService.logOut()
                  this.dialogRef.close()
                })
            })
        }
      })
  }
}
