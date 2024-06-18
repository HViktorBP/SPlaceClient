import { Component } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faTrashArrowUp} from "@fortawesome/free-solid-svg-icons/faTrashArrowUp";
import {GroupsService} from "../../../../../services/groups.service";
import {UsersDataService} from "../../../../../services/users-data.service";
import {UserService} from "../../../../../services/user.service";
import {NgToastService} from "ng-angular-popup";
import {GroupHubService} from "../../../../../services/group-hub.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-delete-group',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './delete-group.component.html',
  styleUrl: './delete-group.component.scss'
})
export class DeleteGroupComponent {
  icon = faTrashArrowUp

  constructor(private group : GroupsService,
              private route : ActivatedRoute,
              private auth : UserService,
              private toast : NgToastService,
              private groupHub : GroupHubService,
              private userData : UsersDataService) {

  }

  deleteGroup() {
    const deleteUserSubscription = this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
      this.group.deleteGroup(userID, this.userData.getUserCurrentGroupId).subscribe({
        next:res => {
          this.toast.success({detail:'Success', summary: res.message, duration: 3000})
          this.groupHub.deleteGroup(this.userData.getUserCurrentGroupId).then(
            () => {
              deleteUserSubscription.unsubscribe()
            }
          ).catch(error => {
            this.toast.error({detail:'Error', summary: error, duration: 3000})
          })
        },
        error:err => {
          this.toast.error({detail:'Error', summary: err.error.message, duration: 3000})
        }
      })

    })
  }
}
