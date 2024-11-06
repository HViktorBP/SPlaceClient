import {Component} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf, SlicePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";
import {UsersDataService} from "../../../../services/states/users-data.service";
import {MatCard} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";
import {MatLine} from "@angular/material/core";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-created-groups',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    AsyncPipe,
    SlicePipe,
    FaIconComponent,
    MatCard,
    MatList,
    MatListItem,
    MatLine,
    MatDivider,
    NgIf
  ],
  templateUrl: './created-groups.component.html',
  styleUrl: '../../../../custom/styles/info-list-box.scss'
})
export class CreatedGroupsComponent {
  icon = faUsers

  constructor(public userData : UsersDataService) {

  }
}
