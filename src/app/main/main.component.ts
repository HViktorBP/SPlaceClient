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
import {UsersService} from "../services/users.service";
import {UsersDataService} from "../states/users-data.service";
import {ApplicationHubService} from "../services/application-hub.service";
import {NgToastService} from "ng-angular-popup";
import {CreateGroupComponent} from "./create-group/create-group.component";
import {LogOutComponent} from "./log-out/log-out.component";

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
    CreateGroupComponent,
    LogOutComponent,
  ]
})
export class MainComponent implements OnInit, OnDestroy{
  private breakpointObserver = inject(BreakpointObserver);
  userData !: Subscription

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private userService : UsersService,
              public userDataService : UsersDataService,
              private applicationHub : ApplicationHubService,
              private toast : NgToastService) {
  }

  ngOnInit() {
    try {
      const userId = this.userService.getUserId();

      this.userData = this.userService.getUserAccount(userId).subscribe(user => {
        this.userDataService.updateUsername(user.username)
        this.userDataService.updateStatus(user.status)
        this.userDataService.updateGroupData(user.groups)
        this.userDataService.updateCreatedGroupData(user.createdGroups)
        this.userDataService.updateCreatedQuizzesData(user.createdQuizzes)
        this.userDataService.updateUserScores(user.scores)

        this.applicationHub.start().then(
          () => {
            console.log('Connected to the application hub!')
            this.applicationHub.addUserConnection(this.userService.getUserName()).then(
              () => {
                console.log('Connection established!')
                user.groups.forEach(g => {
                  this.applicationHub.setGroupConnection(g.id).catch(
                    (reason) => this.toast.error({detail: "Error", summary: reason, duration: 3000})
                  )
                })
              }
            ).catch(
              (reason) => this.toast.error({detail: "Error", summary: reason, duration: 3000})
            ).finally(
              () => console.log('Connection to groups established!')
            )
          }
        ).catch(
          (reason) => this.toast.error({detail: "Error", summary: reason, duration: 3000})
        )
      })
    } catch (e : any) {
      this.toast.error({detail: "Error", summary: e, duration: 3000})
    }
  }

  ngOnDestroy() {
    this.userData.unsubscribe()
    this.applicationHub.leave().then(() => {console.log('Disconnected from the group hub!')})
  }
}
