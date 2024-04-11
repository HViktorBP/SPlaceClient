import {Component, OnInit} from '@angular/core';
import {AuthorisationService} from "../../../services/authorisation.service";
import {GroupsService} from "../../../services/groups.service";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {forkJoin, map, Observable, switchMap} from "rxjs";

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
export class GroupsInfoComponent implements OnInit {
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
}
