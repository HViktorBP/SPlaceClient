import {Component, OnInit} from '@angular/core';
import {MainBarComponent} from "./main-bar/main-bar.component";
import {SideBarComponent} from "./side-bar/side-bar.component";
import {RouterOutlet} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {AuthorisationService} from "../services/authorisation.service";
import {User} from "../interfaces/user";

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
    profilePicture : '',
    language : '',
    status : '',
    email : ''
  }

  constructor(private auth : AuthorisationService) {
  }

  ngOnInit() {
    this.auth.getUser(this.auth.getUsername()).subscribe(data => {
      this.userData = data
  })
  }
}
