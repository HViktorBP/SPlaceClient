import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {catchError, take, throwError} from 'rxjs';
import {RouterLink, RouterOutlet} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {UsersService} from "../../services/users.service";
import {UserDataService} from "../../services/states/user-data.service";
import {ApplicationHubService} from "../../services/application-hub.service";
import {CreateGroupComponent} from "./create-group/create-group.component";
import {LogOutComponent} from "./user-menu/log-out/log-out.component";
import {UserMenuComponent} from "./user-menu/user-menu.component";
import {MatDialog} from "@angular/material/dialog";
import {AboutAppComponent} from "./about-app/about-app.component";

/**
 * MainComponent is responsible for uploading user's data and providing the main UI for application to be used.
 */

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
    NgIf,
    NgClass,
    UserMenuComponent,
  ]
})

export class MainComponent implements OnInit, OnDestroy{
  /**
   * Description: opens the MatDialog
   */
  readonly dialog = inject(MatDialog)

  /**
   * Description: decorator for watching a MatSidenav
   */
  @ViewChild(MatSidenav)

  /**
   * Description: Sidenav variable
   */
  sidenav!: MatSidenav

  /**
   * Description: List icon
   */

  constructor(private userService : UsersService,
              public userDataService : UserDataService,
              private applicationHub : ApplicationHubService) {
  }

  ngOnInit() {
    const userId = this.userService.getUserId()

    if (!sessionStorage.getItem("aboutAppPopUpShowed")) {
      this.dialog.open(AboutAppComponent)
      sessionStorage.setItem("aboutAppPopUpShowed", 'true')
    }

    this.userService.getUserAccount(userId)
      .pipe(
        take(1),
        catchError(error => {
          return throwError(() => error)
        })
        )
      .subscribe(user => {
        this.userDataService.updateUsername(user.username)
        this.userDataService.updateStatus(user.status)
        this.userDataService.updateGroupData(user.groups)
        this.userDataService.updateCreatedGroupData(user.createdGroups)
        this.userDataService.updateCreatedQuizzesData(user.createdQuizzes)
        this.userDataService.updateUserScores(user.scores)

        this.applicationHub.start()
          .then(() => {
            this.applicationHub.addUserConnection(this.userService.getUserName())
              .then(() => {
                user.groups.forEach(g => {
                  this.applicationHub.setGroupConnection(g.id)
                })
              })
          }).catch()
        })
  }

  ngOnDestroy() {
    this.applicationHub
      .leave()
  }

  /**
   * Description: onCreateNewGroup method opens new dialog where user can create a group
   * @memberOf MainComponent
   */
  onCreateNewGroup() {
    this.dialog.open(CreateGroupComponent)
  }
}
