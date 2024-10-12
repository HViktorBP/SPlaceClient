import {Component, Input, OnInit} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {MessagesService} from "../../../../../services/messages.service";
import {UsersService} from "../../../../../services/users.service";

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    DatePipe,
    NgIf
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
  own!: boolean
  edited!:boolean

  constructor(private messagesService : MessagesService,
              private userService : UsersService) {
  }

  ngOnInit() {
    this.own = this.userService.getUserId() == this.userId
  }

  editMessage() {

    this.edited = true
  }

  deleteMessage() {

  }
}
