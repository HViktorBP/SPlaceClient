import {Component, ElementRef, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {UsersService} from "../../../../../services/users.service";
import {GroupDataService} from "../../../../../services/states/group-data.service";
import {FormsModule} from "@angular/forms";
import {MessagesService} from "../../../../../services/messages.service";
import {ApplicationHubService} from "../../../../../services/application-hub.service";
import {SaveMessageRequest} from "../../../../../data-transferring/contracts/message/save-message-request";
import {MessageComponent} from "./message/message.component";
import {catchError, Subscription, throwError} from "rxjs";
import {MatError} from "@angular/material/form-field";

/**
 * ChatComponent responsible for chat's UI
 */
@Component({
    selector: 'app-chat',
    imports: [
        AsyncPipe,
        NgForOf,
        NgIf,
        FormsModule,
        MessageComponent,
        MatError
    ],
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss'
})

export class ChatComponent implements OnInit, OnDestroy {
  /**
   * Description: input field for message
   */
  inputMessage= ''

  /**
   * Description: subscription to the scroll
   */
  subscriptionToScroll!: Subscription;

  /**
   * Description: decorator the views the container of messages
   * @private
   */
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(private messagesService : MessagesService,
              private userService : UsersService,
              private applicationHub : ApplicationHubService,
              public groupDataService : GroupDataService) {
  }

  ngOnInit() {
    this.scrollToBottom()
    this.subscriptionToScroll = this.groupDataService.groupMessages$.subscribe(() => {
      setTimeout(() => this.scrollToBottom(), 100)
    })
  }

  /**
   * Description: sendMessages calls the HTTP request for saving message into the database and if the request was successful than broadcasts this message to all the other user's in the group
   */
  sendMessage() {
    const userId = this.userService.getUserId()
    const groupId = this.groupDataService.currentGroupId

    const saveMessageRequest : SaveMessageRequest = {
      userId: userId,
      groupId: groupId,
      message: this.inputMessage.trim(),
    }

    this.messagesService.saveMessage(saveMessageRequest)
      .pipe(
        catchError(error => {
          return throwError(() => error)
        })
      )
      .subscribe({
        next: (message) => {
          this.applicationHub
            .sendMessage(message)
            .then(() => this.inputMessage = '')
        }
    })
  }

  /**
   * Description: scrollToBottom methods scrolls to the last message automatically whenever the new message appears in the chat
   * @private
   */
  scrollToBottom() {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) {

    }
  }

  ngOnDestroy() {
    this.subscriptionToScroll.unsubscribe()
  }
}
