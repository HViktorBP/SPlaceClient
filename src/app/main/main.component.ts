import {Component, OnInit} from '@angular/core';
import {MainBarComponent} from "./main-bar/main-bar.component";
import {SideBarComponent} from "./side-bar/side-bar.component";
import {RouterOutlet} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {UserService} from "../services/user.service";
import {UsersDataService} from "../services/users-data.service";
import {GroupHubService} from "../services/group-hub.service";
import {GroupsService} from "../services/groups.service";
import {AppHubService} from "../services/app-hub.service";


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MainBarComponent,
    SideBarComponent,
    RouterOutlet,
    HomeComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
  constructor(private auth : UserService,
              private userDataService : UsersDataService,
              private groupHub : GroupHubService,
              private appHub : AppHubService,
              private group : GroupsService) {
    this.appHub.start().then(()=> {
      console.log('Connected to the app hub!')
    })
    this.groupHub.start().then(() => {console.log('Connected to the group hub!')})
  }

  ngOnInit() {
    this.auth.getUserByName(this.auth.getUsername()).subscribe(data => {
      this.userDataService.updateUsername(data.username)
      this.userDataService.updateStatus(data.status)
    })

    this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
      this.group.getGroups(userID).subscribe(groups => {
        groups.forEach(groupID => {
          this.groupHub.joinChat(this.auth.getUsername(), groupID.toString()).then(() => {
            console.log('Connected')
          })
        })
      })
    })

  }
}
