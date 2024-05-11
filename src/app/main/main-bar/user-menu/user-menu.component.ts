import {Component, OnInit} from '@angular/core';
import {NgClass, NgOptimizedImage} from "@angular/common";
import {UsersDataService} from "../../../services/users-data.service";

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})

export class UserMenuComponent implements OnInit{
  username : string | undefined
  status : string | undefined

  constructor(private userData : UsersDataService) {

  }

  ngOnInit() {
    this.userData.userName$.subscribe(username => this.username = username)
    this.userData.userStatus$.subscribe(status => this.status = status)
  }
}
