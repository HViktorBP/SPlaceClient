import {Component, OnDestroy, OnInit} from '@angular/core';
import {AddUserComponent} from "./add-user/add-user.component";
import {RemoveUserComponent} from "./remove-user/remove-user.component";
import {LeaveGroupComponent} from "./leave-group/leave-group.component";
import {DeleteGroupComponent} from "./delete-group/delete-group.component";
import {UsersDataService} from "../../../../services/users-data.service";
import {NgIf} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-group-options',
  standalone: true,
  imports: [
    AddUserComponent,
    RemoveUserComponent,
    LeaveGroupComponent,
    DeleteGroupComponent,
    NgIf,
  ],
  templateUrl: './group-options.component.html',
  styleUrl: './group-options.component.scss'
})
export class GroupOptionsComponent implements OnInit, OnDestroy {
  userRole : string = ''
  roleSubscription !: Subscription

  constructor(private userData : UsersDataService) {
  }

  ngOnInit() {
    this.roleSubscription = this.userData.userRole$.subscribe(role => this.userRole = role)
  }

  ngOnDestroy() {
    this.roleSubscription.unsubscribe()
  }
}
