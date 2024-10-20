import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {faUserPlus} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GroupsService} from "../../../../../services/groups.service";
import {FormsModule, NgForm} from "@angular/forms";
import {UsersService} from "../../../../../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {AddUserRequest} from "../../../../../contracts/group/add-user-request";
import {PopUpService} from "../../../../../services/pop-up.service";
import {GroupDataService} from "../../../../../states/group-data.service";
import {take} from "rxjs";
import {ApplicationHubService} from "../../../../../services/application-hub.service";

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent,
    FormsModule
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  icon = faUserPlus

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private groupDataService : GroupDataService,
              private toast : NgToastService,
              private applicationHubService : ApplicationHubService,
              public popUpService : PopUpService) {
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

    const addUserRequest : AddUserRequest = {
      userId : userId,
      groupId : groupId,
      userToAddName : form.value.userName,
      role : +form.value.userRole
    }

    this.groupService.addUser(addUserRequest)
      .pipe(take(1))
      .subscribe({
        next : res => {
          this.applicationHubService.addToGroup(addUserRequest.groupId, addUserRequest.userToAddName)
            .then(
              () => {
                this.toast.success({detail:"Info", summary: res, duration:3000})
              }
            )
            .catch(error => {
              this.toast.success({detail:"Error", summary: error, duration:3000})
            })

          this.popUpService.dismissThePopup()
        },
        error : err => {
          this.toast.error({detail:"Error", summary: err, duration:3000})
        }
      })
  }
}
