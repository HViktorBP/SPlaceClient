import {Component} from '@angular/core';
import {UsersService} from "../../../services/users.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PopUpService} from "../../../services/pop-up.service";
import {NgToastService} from "ng-angular-popup";
import {take} from "rxjs";
import {ApplicationHubService} from "../../../services/application-hub.service";
import {UsersDataService} from "../../../states/users-data.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-delete-account',
  standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './delete-account.component.html',
  styleUrl: './delete-account.component.scss'
})
export class DeleteAccountComponent {

  constructor(private popUpService : PopUpService,
              private toast : NgToastService,
              private applicationHubService : ApplicationHubService,
              private usersDataService : UsersDataService,
              private userService : UsersService,
              private router : Router) { }

  open(content: any) {
    this.popUpService.openModal(content).then(
      () => {
        this.onSubmit();
      },
      (reason) => {
        console.log(`Dismissed ${this.popUpService.getDismissReason(reason)}`);
      }
    );
  }

  onSubmit() {
    const groupToDelete = this.usersDataService.createdGroups.map(g => g.id)
    this.userService.deleteAccount()
      .pipe(take(1))
      .subscribe({
        next : res => {
          this.applicationHubService.deleteUser(groupToDelete)
            .then(
              () => {
                this.toast.info({detail:"Info", summary: res, duration:3000})
              }
            )
            .catch(error => {
              this.toast.success({detail:"Error", summary: error, duration:3000})
            })
          this.popUpService.dismissThePopup()
          this.router.navigate(['login']).then(
            () => sessionStorage.clear()
          );
        },
        error : err => {
          this.toast.error({detail:"Error", summary: err, duration:3000})
        }
      })
  }
}
