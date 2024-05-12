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
    this.auth.getUserID(this.auth.getUsername()).subscribe(userId => {
      this.userData.groupId$.subscribe(groupID => {
        this.group.getUserRole(userId, groupID).subscribe( role => {
          this.group.deleteUserFromGroup(userId, groupID, role[0]).subscribe({
            next: res => {
              this.toast.success({detail: "Success", summary: res.message, duration: 3000})
              this.groupHub.leaveChat().then(() => {
                this.toast.success({detail: "Success", summary: "You left the group!", duration: 3000})
              }).catch(e => {
                this.toast.error({detail: "Error", summary: e.message, duration: 3000})
              })
              this.router.navigate(['main/home'])
            },
            error: err => {
              this.toast.error({detail: "Error", summary: err.error.message, duration: 3000})
            }
          })
        })
      })
      }
    )
  }
}
