import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, SlicePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";
import {UsersDataService} from "../../../states/users-data.service";

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
  styleUrl: './groups-info.component.scss'
})
export class GroupsInfoComponent implements OnInit {
  icon = faUsers

  constructor(public userData : UsersDataService) {

  }
  ngOnInit(): void {
  }
}
