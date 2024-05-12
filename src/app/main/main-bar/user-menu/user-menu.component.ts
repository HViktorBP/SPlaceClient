import {Component, OnInit} from '@angular/core';
import {NgClass, NgOptimizedImage} from "@angular/common";
import {UsersDataService} from "../../../services/users-data.service";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgClass,
    FaIconComponent
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})

export class UserMenuComponent implements OnInit{
  username : string | undefined
  status : string | undefined
  logOutIcon = faRightFromBracket

  constructor(private userData : UsersDataService,
              private router : Router) {

  }

  ngOnInit() {
    this.userData.userName$.subscribe(username => this.username = username)
    this.userData.userStatus$.subscribe(status => this.status = status)
  }


  logOut() {
    sessionStorage.clear()
    this.router.navigate(['login'])
  }
}
