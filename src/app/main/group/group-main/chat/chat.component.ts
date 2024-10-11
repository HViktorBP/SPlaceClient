import {Component, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {UsersService} from "../../../../services/users.service";
import {GroupDataService} from "../../../../states/group-data.service";
import {FormsModule} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {MessagesService} from "../../../../services/messages.service";
import {MessageDto} from "../../../../dtos/message/message-dto";
import {NgToastService} from "ng-angular-popup";
import {ApplicationHubService} from "../../../../services/application-hub.service";
import {SaveMessage} from "../../../../contracts/message/save-message";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgForOf,
    NgIf,
    NgOptimizedImage,
    NgClass,
    FormsModule
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit {
  loggedInUserName!: number;
  inputMessage= ''

  constructor(private messagesService : MessagesService,
              private userService : UsersService,
              private applicationHub : ApplicationHubService,
              public groupDataService : GroupDataService,
              private toast : NgToastService,
              private route : ActivatedRoute) {
  }

  ngOnInit() {
    this.loggedInUserName = this.userService.getUserId()
  }

  sendMessage() {
    const userId = this.userService.getUserId()
    const groupId = this.groupDataService.currentGroupId

    const saveMessageRequest : SaveMessage = {
      userId: userId,
      groupId: groupId,
      message: this.inputMessage.trim(),
    }

    this.messagesService.saveMessage(saveMessageRequest).subscribe({
      next: (message) => {
        this.applicationHub.sendMessage(message).catch(
          (reason) => this.toast.error({detail:"Error", summary: reason, duration:3000})
        )
      },
      error: err => this.toast.error({detail:"Error", summary: err, duration:3000})
    })
  }
}
