import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {AuthorisationService} from "../../../services/authorisation.service";
import {GroupsService} from "../../../services/groups.service";
import {RouterLink} from "@angular/router";
import {forkJoin, map, Observable, switchMap} from "rxjs";
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

export class MenuComponent implements OnInit {
  menuSliding : string = 'in';
  userGroupData: { name: string; id: number }[]= []

  constructor(private auth: AuthorisationService, private groups : GroupsService) {

  }

  ngOnInit(): void {
    this.auth.getUserID(this.auth.getUsername()).pipe(
      switchMap(userID => this.groups.getGroups(userID)),
      switchMap(groups => {
        const observables: Observable<{ name: string; id: number }>[] = groups.map(groupID => {
          return this.groups.getGroupById(groupID).pipe(
            map(groupName => ({ id: groupID, name: groupName }))
          );
        });
        return forkJoin(observables);
      })
    ).subscribe(groupInfos => {
      this.userGroupData.push(...groupInfos);
    });
  }

  toggleMenu() {
    this.menuSliding = this.menuSliding == 'in' ? 'out' : 'in';
    //window.location.reload()
  }

  addGroup() {

  }
}
