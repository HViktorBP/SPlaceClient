import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {GroupsService} from "../../../services/groups.service";
import {AsyncPipe, NgForOf, SlicePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {BehaviorSubject, forkJoin, map, Observable, switchMap} from "rxjs";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";

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
  userGroupData: { name: string; id: number }[]= []
  userGroupData$: BehaviorSubject<{ name: string; id: number }[]> = new BehaviorSubject<{name: string; id: number}[]>([])
  icon = faUsers

  constructor(private auth: UserService, private groups : GroupsService) {

  }
  ngOnInit(): void {
    this.updateData()
  }

  updateData() {
    this.userGroupData.length = 0;
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
      this.userGroupData$.next(this.userGroupData)
    })
  }
}
