import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {AsyncPipe, NgForOf, SlicePipe} from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {Observable, Subscription} from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {RouterLink, RouterOutlet} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {UserService} from "../services/user.service";
import {UsersDataService} from "../services/users-data.service";
import {GroupHubService} from "../services/group-hub.service";
import {AppHubService} from "../services/app-hub.service";
import {GroupsService} from "../services/groups.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterOutlet,
    FaIconComponent,
    NgForOf,
    SlicePipe,
    RouterLink,
  ]
})
export class MainComponent implements OnInit, OnDestroy{
  private breakpointObserver = inject(BreakpointObserver);
  public groups$ !: Observable<{ name: string; id: number }[]>;
  userData !: Subscription
  userGroupConnection !: Subscription

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private userService : UserService,
              private userDataService : UsersDataService,
              private groupHub : GroupHubService,
              private appHub : AppHubService,
              private group : GroupsService) {
    this.appHub.start().then(()=> {console.log('Connected to the app hub!')})
    this.groupHub.start().then(() => {console.log('Connected to the group hub!')})
  }

  ngOnInit() {
    this.userDataService.updateGroupsList(this.userService.getUsername())
    this.groups$ = this.userDataService.userGroupData$

    this.userData = this.userService.getUserByName(this.userService.getUsername()).subscribe(data => {
      this.userDataService.updateUsername(data.username)
      this.userDataService.updateStatus(data.status!)
    })

    this.userGroupConnection = this.userService.getUserID(this.userService.getUsername()).subscribe(userID => {
      this.group.getGroups(userID).subscribe(groups => {
        groups.forEach(groupID => {
          this.groupHub.joinChat(this.userService.getUsername(), groupID.toString()).then(() => {
          })
        })
      })
    })
  }

  ngOnDestroy() {
    this.userData.unsubscribe()
    this.userGroupConnection.unsubscribe()
    this.appHub.leave().then(()=> {console.log('Disconnected from the app hub!')})
    this.groupHub.leave().then(() => {console.log('Disconnected from the group hub!')})
  }
}
