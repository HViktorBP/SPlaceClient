import {Component} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {AuthorisationService} from "../../../services/authorisation.service";
import {GroupsService} from "../../../services/groups.service";
import {RouterLink} from "@angular/router";
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})

export class MenuComponent {
  menuSliding : string = 'in';
  userGroups: string[] = []

  constructor(private auth: AuthorisationService, private groups : GroupsService) {
    this.auth.getUserID(this.auth.getUsername()).subscribe(data => {
      this.groups.getGroups(data).subscribe(data => {
        this.userGroups = data
      })
    })
  }

  toggleMenu() {
    this.menuSliding = this.menuSliding == 'in' ? 'out' : 'in';
  }

  addGroup() {

  }
}
