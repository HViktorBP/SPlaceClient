import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {AsyncPipe, NgForOf, SlicePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";
import {UsersDataService} from "../../../services/users-data.service";

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
              public userData : UsersDataService) {

  }
  ngOnInit(): void {
    this.userData.updateGroupsList(this.auth.getUsername())
  }
}
