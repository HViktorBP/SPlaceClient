import {Component} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faTrashArrowUp} from "@fortawesome/free-solid-svg-icons/faTrashArrowUp";
import {GroupsService} from "../../../../../services/groups.service";
import {UsersService} from "../../../../../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {PopUpService} from "../../../../../services/pop-up.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserGroupRequest} from "../../../../../contracts/group/user-group-request";
import {GroupDataService} from "../../../../../states/group-data.service";
import {take} from "rxjs";
import {ApplicationHubService} from "../../../../../services/application-hub.service";

@Component({
  selector: 'app-delete-group',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './delete-group.component.html',
  styleUrl: './delete-group.component.scss'
})
export class DeleteGroupComponent {
  icon = faTrashArrowUp

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private groupDataService : GroupDataService,
              private applicationHubService : ApplicationHubService,
              public popUpService : PopUpService,
              private toast : NgToastService) {
  }

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
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    const deleteGroupRequest : UserGroupRequest = {
      userId : userId,
      groupId : groupId,
    }

    this.groupService.deleteGroup(deleteGroupRequest)
      .pipe(take(1))
      .subscribe({
        next : () => {
          this.applicationHubService.deleteGroup(deleteGroupRequest.groupId)
            .catch(error => {
              this.toast.success({detail:"Error", summary: error, duration:3000})
            })
        },
        error : err => {
          this.toast.error({detail:"Error", summary: err, duration:3000})
        }
      })

    this.popUpService.dismissThePopup();
  }
}
