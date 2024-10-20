import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GroupsService} from "../../../../../services/groups.service";
import {UsersService} from "../../../../../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {PopUpService} from "../../../../../services/pop-up.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserGroupRequest} from "../../../../../contracts/group/user-group-request";
import {GroupDataService} from "../../../../../states/group-data.service";
import {switchMap, take} from "rxjs";
import {ApplicationHubService} from "../../../../../services/application-hub.service";
import {map} from "rxjs/operators";
import {UsersDataService} from "../../../../../states/users-data.service";

@Component({
  selector: 'app-leave-group',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './leave-group.component.html',
  styleUrl: './leave-group.component.scss'
})
export class LeaveGroupComponent {
  icon = faRightFromBracket

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private groupDataService : GroupDataService,
              private userDataService : UsersDataService,
              private applicationHubService : ApplicationHubService,
              public popUpService : PopUpService,
              private toast : NgToastService,
              private router : Router) {
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

    const leaveGroupRequest : UserGroupRequest = {
      userId : userId,
      groupId : groupId
    }

    this.groupService.leaveGroup(leaveGroupRequest)
      .pipe(
        take(1),
        switchMap(() => {
          return this.userService.getUserAccount(this.userService.getUserId())
            .pipe(
              map(user => user.groups)
            )
        })
      )
      .subscribe({
        next : groups => {
          this.userDataService.updateGroupData(groups)
          this.applicationHubService.leaveTheGroup(leaveGroupRequest.groupId)
            .then(
              () => {
                this.toast.info({detail:"Info", summary: 'You left the group', duration:3000})
              }
            )
            .catch(error => {
              this.toast.success({detail:"Error", summary: error, duration:3000})
            })
          this.router.navigate(['main/home']).then(
            () => this.popUpService.dismissThePopup()
          )
        },
        error : err => {
          this.toast.error({detail:"Error", summary: err, duration:3000})
        }
      })
  }
}
