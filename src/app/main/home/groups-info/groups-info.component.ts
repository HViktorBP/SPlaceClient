import { Component } from '@angular/core';
import {AuthorisationService} from "../../../services/authorisation.service";
import {GroupsService} from "../../../services/groups.service";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-groups-info',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink
  ],
  templateUrl: './groups-info.component.html',
  styleUrl: './groups-info.component.css'
})
export class GroupsInfoComponent {
  userGroups: string[] = []

  constructor(private auth: AuthorisationService, private groups : GroupsService) {
    this.auth.getUserID(this.auth.getUsername()).subscribe(data => {
      this.groups.getGroups(data).subscribe(data => {
        this.userGroups = data
      })
    })
  }


}
