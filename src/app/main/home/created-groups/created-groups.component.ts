import {Component} from '@angular/core';
import {AsyncPipe, NgForOf, SlicePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";
import {UsersDataService} from "../../../states/users-data.service";

@Component({
  selector: 'app-created-groups',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    AsyncPipe,
    SlicePipe,
    FaIconComponent
  ],
  templateUrl: './created-groups.component.html',
  styleUrl: './created-groups.component.scss'
})
export class CreatedGroupsComponent {
  icon = faUsers

  constructor(public userData : UsersDataService) {

  }
}
