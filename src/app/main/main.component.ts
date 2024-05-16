import {Component, OnInit} from '@angular/core';
import {MainBarComponent} from "./main-bar/main-bar.component";
import {SideBarComponent} from "./side-bar/side-bar.component";
import {RouterOutlet} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {UserService} from "../services/user.service";
import {User} from "../interfaces/user";
import {UsersDataService} from "../services/users-data.service";


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
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  userData : User = {
    username : '',
    status : '',
    email : ''
  }

  constructor(private auth : UserService,
              private userDataService : UsersDataService) {

  }

  ngOnInit() {
    this.auth.getUserByName(this.auth.getUsername()).subscribe(data => {
      this.userData = data
      this.userDataService.updateUsername(this.userData.username)
      this.userDataService.updateStatus(this.userData.status)
    })
    this.userDataService.updateGroupId(0);
  }
}
