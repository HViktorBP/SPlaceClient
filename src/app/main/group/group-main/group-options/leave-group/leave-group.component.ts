import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ChatService} from "../../../../../services/chat.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-leave-group',
  standalone: true,
    imports: [
        NgOptimizedImage
    ],
  templateUrl: './leave-group.component.html',
  styleUrl: './leave-group.component.css'
})
export class LeaveGroupComponent {

  constructor(private chat: ChatService,
              private router: Router) {

  }

  leaveChat() {
    this.chat.leaveChat().then(() => {
      this.router.navigate(['main/home'])
    }).catch(e => {
      console.log(e)
    })
  }
}
