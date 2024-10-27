import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {UsersService} from "../../../../services/users.service";
import {GroupDataService} from "../../../../states/group-data.service";
import {FormsModule} from "@angular/forms";
import {MessagesService} from "../../../../services/messages.service";
import {NgToastService} from "ng-angular-popup";
import {ApplicationHubService} from "../../../../services/application-hub.service";
import {SaveMessageRequest} from "../../../../data-transferring/contracts/message/save-message-request";
import {MessageComponent} from "./message/message.component";
import {take} from "rxjs";

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
  loggedInUserName!: number;
  inputMessage= ''
  messagesContainer !: HTMLElement;

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor(private messagesService : MessagesService,
              private userService : UsersService,
              private applicationHub : ApplicationHubService,
              public groupDataService : GroupDataService,
              private toast : NgToastService) {
  }

  ngOnInit() {
    this.loggedInUserName = this.userService.getUserId()
    this.scrollToBottom()
  }

  ngAfterViewChecked() {
    this.scrollToBottom()

  }

  sendMessage() {
    const userId = this.userService.getUserId()
    const groupId = this.groupDataService.currentGroupId

    const saveMessageRequest : SaveMessageRequest = {
      userId: userId,
      groupId: groupId,
      message: this.inputMessage.trim(),
    }

    this.messagesService.saveMessage(saveMessageRequest)
      .pipe(take(1))
      .subscribe({
      next: (message) => {
        this.applicationHub.sendMessage(message)
          .then(() => this.inputMessage = '')
          .catch( (reason) => this.toast.error({detail:"Error", summary: reason, duration:3000}) )
      },
      error: err => this.toast.error({detail:"Error", summary: err, duration:3000})
    })
  }

  private scrollToBottom() {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.log(err);
    }
  }
}
