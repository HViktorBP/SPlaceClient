import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {AsyncPipe, NgForOf, SlicePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";
import {UsersDataService} from "../../../services/users-data.service";
import {GroupHubService} from "../../../services/group-hub.service";

@Component({
  selector: 'app-groups-info',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    AsyncPipe,
    SlicePipe,
    FaIconComponent
  ],
  templateUrl: './groups-info.component.html',
  styleUrl: './groups-info.component.css'
})
export class GroupsInfoComponent implements OnInit {
  icon = faUsers
  constructor(private auth: UserService,
              public userData : UsersDataService,
              public groupHub : GroupHubService) {

  }
  ngOnInit(): void {
    this.userData.updateGroupsList(this.auth.getUsername())
  }

  onGroupClicked(groupId : number) {
    this.groupHub.joinChat(this.auth.getUsername(), groupId.toString()).then(() => {
    })
  }
}
