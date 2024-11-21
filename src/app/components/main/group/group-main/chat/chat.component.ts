import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {UsersService} from "../../../../../services/users.service";
import {GroupDataService} from "../../../../../services/states/group-data.service";
import {FormsModule} from "@angular/forms";
import {MessagesService} from "../../../../../services/messages.service";
import {ApplicationHubService} from "../../../../../services/application-hub.service";
import {SaveMessageRequest} from "../../../../../data-transferring/contracts/message/save-message-request";
import {MessageComponent} from "./message/message.component";
import {catchError, take, throwError} from "rxjs";

/**
 * ChatComponent responsible for chat's UI
 */
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
    FormsModule,
    MessageComponent
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})

export class ChatComponent implements OnInit, AfterViewChecked {
  /**
   * Description: input field for message
   * @protected
   */
  inputMessage= ''

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
  }

  ngAfterViewChecked() {
    this.scrollToBottom()
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
        take(1),
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
}
