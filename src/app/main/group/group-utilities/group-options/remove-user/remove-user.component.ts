import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUserMinus} from "@fortawesome/free-solid-svg-icons";
import {FormsModule, NgForm} from "@angular/forms";
import {UsersService} from "../../../../../services/users.service";
import {GroupsService} from "../../../../../services/groups.service";
import {NgToastService} from "ng-angular-popup";
import {PopUpService} from "../../../../../services/pop-up.service";
import {RemoveUserRequest} from "../../../../../contracts/group/remove-user-request";
import {GroupDataService} from "../../../../../states/group-data.service";
import {take} from "rxjs";
import {ApplicationHubService} from "../../../../../services/application-hub.service";

@Component({
  selector: 'app-remove-user',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent,
    FormsModule
  ],
  templateUrl: './remove-user.component.html',
  styleUrl: './remove-user.component.scss'
})
export class RemoveUserComponent {
  icon = faUserMinus;

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private groupDataService : GroupDataService,
              private applicationHubService : ApplicationHubService,
              public popUpService : PopUpService,
              private toast : NgToastService) {
  }

  open(content: any) {
    this.popUpService.openModal(content).then(
      (result) => {
        this.onSubmit(result);
      },
      (reason) => {
        console.log(`Dismissed ${this.popUpService.getDismissReason(reason)}`);
      }
    );
  }

  onSubmit(form: NgForm) {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    const removeUserRequest : RemoveUserRequest = {
      userId : userId,
      groupId : groupId,
      userToDeleteName : form.value.userName,
    }

    this.groupService.removeUser(removeUserRequest)
      .pipe(take(1))
      .subscribe({
        next : res => {
          this.applicationHubService.removeUser(removeUserRequest.userToDeleteName, removeUserRequest.groupId)
            .then(
              () => {
                this.toast.success({detail:"Info", summary: res, duration:3000})
              }
            )
            .catch(error => {
              this.toast.success({detail:"Error", summary: error, duration:3000})
            })
          this.toast.success({detail:"Info", summary: res, duration:3000})
          this.popUpService.dismissThePopup()
        },
        error : err => {
          this.toast.error({detail:"Error", summary: err, duration:3000})
        }
      })
  }
}
