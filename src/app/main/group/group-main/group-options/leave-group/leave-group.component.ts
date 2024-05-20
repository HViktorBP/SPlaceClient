import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GroupsService} from "../../../../../services/groups.service";
import {UserService} from "../../../../../services/user.service";
import {GroupHubService} from "../../../../../services/group-hub.service";
import {NgToastService} from "ng-angular-popup";
import {UsersDataService} from "../../../../../services/users-data.service";

@Component({
  selector: 'app-leave-group',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent
  ],
  templateUrl: './leave-group.component.html',
  styleUrl: './leave-group.component.css'
})
export class LeaveGroupComponent {
  icon = faRightFromBracket
  constructor(private router: Router,
              private groupHub : GroupHubService,
              private group : GroupsService,
              private auth : UserService,
              private toast : NgToastService,
              private userData : UsersDataService) {

  }

  leaveGroup() {
    this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
      this.userData.groupId$.subscribe(groupID => {
        this.group.leaveGroup(userID, groupID).subscribe({
          next: res => {
            this.toast.info({detail: "Info", summary: res.message, duration: 3000})
            this.groupHub.removeUserFromGroup(this.auth.getUsername(), groupID.toString()).then(() => {
              this.router.navigate(['main/home'])
            }).catch(e => {
              this.toast.error({detail: "Error", summary: e.message, duration: 3000})
            })
          },
          error: err => {
            this.toast.error({detail: "Error", summary: err.error.message, duration: 3000})
          }
        })
      })
      }
    )
  }
}
