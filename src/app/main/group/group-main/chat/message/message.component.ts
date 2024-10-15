import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {MessagesService} from "../../../../../services/messages.service";
import {UsersService} from "../../../../../services/users.service";
import {MessageDto} from "../../../../../dtos/message/message-dto";
import {NgToastService} from "ng-angular-popup";
import {DeleteMessageRequest} from "../../../../../contracts/message/delete-message-request";
import {FormsModule} from "@angular/forms";
import {take} from "rxjs";

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    FormsModule
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})

export class MessageComponent implements OnInit {
  @Input() id!: number
  @Input() userId!: number;
  @Input() userName!: string;
  @Input() groupId!: number;
  @Input() message!: string;
  @Input() timestamp!: Date;
  @Input() isEdited!:boolean
  own!: boolean
  isEditing : boolean = false;
  editableMessage: string = '';


  constructor(private messagesService : MessagesService,
              private userService : UsersService,
              private toast : NgToastService) {
  }

  ngOnInit() {
    this.own = this.userService.getUserId() == this.userId
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    this.editableMessage = this.message
  }

  cancelEdit() {
    this.isEditing = false; // Exit edit mode without saving
  }

  editMessage() {
    const messageDto : MessageDto= {
      groupId: this.groupId,
      id: this.id,
      message: this.editableMessage,
      timestamp: this.timestamp,
      userId: this.userId,
      userName: this.userName,
      isEdited : true
    }

    this.messagesService.editMessage(messageDto)
      .pipe(take(1))
      .subscribe({
      next: (message) => {
        this.toast.success({detail:"Success", summary: message, duration:3000})
        this.isEditing = false;
      },
      error: (err) => {
        this.toast.error({detail:"Success", summary: err, duration:3000})
      }
    })
  }

  deleteMessage() {
    const deleteMessage : DeleteMessageRequest = {
      userId: this.userId,
      groupId: this.groupId,
      messageId: this.id
    }

    this.messagesService.deleteMessage(deleteMessage)
      .pipe(take(1))
      .subscribe({
      next: (message) => {
        this.toast.success({detail:"Success", summary: message, duration:3000})
      },
      error: (err) => {
        this.toast.error({detail:"Error", summary: err, duration:3000})
      }
    })
  }
}
