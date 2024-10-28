import {Component, inject} from '@angular/core';
import {UsersService} from "../../../services/users.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {take} from "rxjs";
import {ApplicationHubService} from "../../../services/application-hub.service";
import {UsersDataService} from "../../../states/users-data.service";
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";

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
export class DeleteAccountComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteAccountComponent>)

  constructor(private toast : NgToastService,
              private applicationHubService : ApplicationHubService,
              private usersDataService : UsersDataService,
              private userService : UsersService,
              private router : Router) { }

  onSubmit() {
    const groupToDelete = this.usersDataService.createdGroups.map(g => g.id)

    this.userService.deleteAccount()
      .pipe(take(1))
      .subscribe({
        next : res => {
          this.applicationHubService.deleteUser(groupToDelete)
            .then(() => {
                this.toast.info({detail:"Info", summary: res.message, duration:3000})
              })

          this.router.navigate(['login'])
            .then(() => {
              sessionStorage.clear()
              this.dialogRef.close()
            });
        }
      })
  }
}
