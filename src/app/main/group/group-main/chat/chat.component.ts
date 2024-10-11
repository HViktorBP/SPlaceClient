import {Component, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {UserService} from "../../../../services/user.service";
import {GroupDataService} from "../../../../states/group-data.service";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgForOf,
    NgIf,
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit{
  loggedInUserName!: number;

  constructor(private userService : UserService,
              public groupDataService : GroupDataService) {
  }

  ngOnInit() {
    this.loggedInUserName = this.userService.getUserId()

  }
}
