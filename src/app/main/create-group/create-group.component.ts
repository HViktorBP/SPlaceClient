import {Component} from '@angular/core';
import {GroupsService} from "../../services/groups.service";
import {UsersService} from "../../services/users.service";
import {CreateGroupRequest} from "../../contracts/group/create-group-request";
import {FormsModule, NgForm} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {PopUpService} from "../../services/pop-up.service";
import {switchMap, take} from "rxjs";
import {UsersDataService} from "../../states/users-data.service";
import {ApplicationHubService} from "../../services/application-hub.service";

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss'
})
export class CreateGroupComponent {
  constructor(private groupService : GroupsService,
              private popUpService : PopUpService,
              private toast : NgToastService,
              private applicationHubService : ApplicationHubService,
              private usersDataService : UsersDataService,
              private userService : UsersService) {

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
    const userId = this.userService.getUserId();

    const createGroupRequest: CreateGroupRequest = {
      userId: userId,
      groupName: form.value.groupName
    };

    this.groupService.createGroup(createGroupRequest)
      .pipe(
        take(1),
        switchMap(() => this.userService.getUserAccount(userId).pipe(
          take(1)
        ))
      )
      .subscribe({
        next: user => {
          this.usersDataService.updateCreatedGroupData(user.createdGroups);
          this.usersDataService.updateGroupData(user.groups);

          const newGroup = user.createdGroups.find(g => g.name === createGroupRequest.groupName)!;
          this.applicationHubService.setGroupConnection(newGroup.id).then(() => {
            this.toast.success({ detail: "Success", summary: 'Group created successfully!', duration: 3000 });
          })

          this.popUpService.dismissThePopup();
        },
        error: err => {
          this.toast.error({ detail: "Error", summary: err, duration: 3000 });
        }
      });
  }

}
