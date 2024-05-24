import { Component } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faTrashArrowUp} from "@fortawesome/free-solid-svg-icons/faTrashArrowUp";
import {GroupsService} from "../../../../../services/groups.service";
import {UsersDataService} from "../../../../../services/users-data.service";
import {UserService} from "../../../../../services/user.service";
import {NgToastService} from "ng-angular-popup";
import {GroupHubService} from "../../../../../services/group-hub.service";

@Component({
  selector: 'app-delete-group',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './delete-group.component.html',
  styleUrl: './delete-group.component.css'
})
export class DeleteGroupComponent {
  icon = faTrashArrowUp

  constructor(private group : GroupsService,
              private userData : UsersDataService,
              private auth : UserService,
              private toast : NgToastService,
              private groupHub : GroupHubService) {

  }

  deleteGroup() {
    this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
      this.userData.groupId$.subscribe(groupID => {
        this.groupHub.deleteGroup(groupID).then(() => {
          this.group.deleteGroup(userID, groupID).subscribe({
            next:res => {
              this.toast.success({detail:'Success', summary: res.message, duration: 3000})
            },
            error:err => {
              this.toast.error({detail:'Error', summary: err.error.message, duration: 3000})
            }
          })
        }).catch(e => {
          this.toast.error({detail:'Error', summary: e.message, duration: 3000})
        })

      })
    })
  }
}
