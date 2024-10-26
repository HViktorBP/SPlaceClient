import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {AsyncPipe, NgClass, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {take} from 'rxjs';
import {RouterLink, RouterOutlet} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {UsersService} from "../services/users.service";
import {UsersDataService} from "../states/users-data.service";
import {ApplicationHubService} from "../services/application-hub.service";
import {NgToastService} from "ng-angular-popup";
import {CreateGroupComponent} from "./create-group/create-group.component";
import {LogOutComponent} from "./user-menu/log-out/log-out.component";
import {faUserGroup} from "@fortawesome/free-solid-svg-icons/faUserGroup";
import {faBars} from "@fortawesome/free-solid-svg-icons/faBars";
import {UserMenuComponent} from "./user-menu/user-menu.component";
import {MatDialog} from "@angular/material/dialog";

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
  title = 'material-responsive-sidenav';
  readonly dialog = inject(MatDialog);
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  listIcon = faUserGroup
  menuIcon = faBars;

  constructor(private userService : UsersService,
              public userDataService : UsersDataService,
              private applicationHub : ApplicationHubService,
              private toast : NgToastService) {
  }

  ngOnInit() {
    try {
      const userId = this.userService.getUserId();

      this.userService.getUserAccount(userId)
        .pipe(take(1))
        .subscribe(user => {
          this.userDataService.updateUsername(user.username)
          this.userDataService.updateStatus(user.status)
          this.userDataService.updateGroupData(user.groups)
          this.userDataService.updateCreatedGroupData(user.createdGroups)
          this.userDataService.updateCreatedQuizzesData(user.createdQuizzes)
          this.userDataService.updateUserScores(user.scores)

          this.applicationHub.start()
            .then(() => {
              console.log('Connected to the application hub!')
              this.applicationHub.addUserConnection(this.userService.getUserName())
                .then(
                () => {
                  console.log('Connection established!')
                  user.groups.forEach(g => {
                    this.applicationHub.setGroupConnection(g.id).catch(
                      (reason) => this.toast.error({detail: "Error", summary: reason, duration: 3000})
                    )
                  })
                })
                .catch(
                  (reason) => this.toast.error({detail: "Error", summary: reason, duration: 3000})
                )
              }
            )
            .catch(
              (reason) => this.toast.error({detail: "Error", summary: reason, duration: 3000})
            )
          }
        )
    } catch (e : any) {
      this.toast.error({detail: "Error", summary: e, duration: 3000})
    }
  }


  ngOnDestroy() {
    this.applicationHub.leave().then(() => {console.log('Disconnected from the group hub!')})
  }

  onCreateNewGroup() {
    this.dialog.open(CreateGroupComponent)
  }

}
