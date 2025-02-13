import {Component, inject, Input, OnInit} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {MessagesService} from "../../../../../../services/messages.service";
import {UsersService} from "../../../../../../services/users.service";
import {MessageDto} from "../../../../../../data-transferring/dtos/message/message-dto";
import {NgToastService} from "ng-angular-popup";
import {FormsModule} from "@angular/forms";
import {catchError, finalize, take, throwError} from "rxjs";
import {ApplicationHubService} from "../../../../../../services/application-hub.service";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmMessageDeleteComponent} from "./confirm-message-delete/confirm-message-delete.component";
import {MatError} from "@angular/material/form-field";

/**
 * MessageComponent is responsible for handling messages' UI.
 */
@Component({
  selector: 'app-message',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    FormsModule,
    MatIconButton,
    MatIcon,
    MatButton,
    MatError
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})

export class MessageComponent implements OnInit {
  readonly dialog = inject(MatDialog)
  /**
   * Description: Message's ID
   */
  @Input() id!: number

  /**
   * Description: ID of the user who wrote the message
   */
  @Input() userId!: number

  /**
   * Description: Name of the user who wrote the message
   */
  @Input() userName!: string

  /**
   * Description: ID of the group to which message belongs
   */
  @Input() groupId!: number

  /**
   * Description: Message itself.
   */
  @Input() message!: string

  /**
   * Description: Time when the message was sent.
   */
  @Input() timestamp!: Date

  /**
   * Description: Indicator for message whether it was edited or not.
   */
  @Input() isEdited!:boolean

  /**
   * Description: Indicates whether the message belong to user or not.
   */
  own!: boolean

  /**
   * Description: Indicates whether user currently edits the message or not.
   */
  isEditing : boolean = false

  /**
   * Description: String which will contain the edited message.
   */
  editableMessage: string = ''

  constructor(private messagesService : MessagesService,
              private userService : UsersService,
              private applicationHubService : ApplicationHubService,
              private toast : NgToastService) {
  }

  ngOnInit() {
    this.own = this.userService.getUserId() == this.userId
  }

  /**
   * Description: showEdit method provides the UI for editing the message
   * @memberOf MessageComponent
   */
  showEdit() {
    this.isEditing = !this.isEditing
    this.editableMessage = this.message
  }

  /**
   * Description: cancelEdit method hides the UI for editing the message
   * @memberOf MessageComponent
   */
  cancelEdit() {
    this.isEditing = false
  }

  /**
   * Description: editMessage method calls the HTTP request for editing the message and handles the UI according to the request's result.
   * @memberOf MessageComponent
   */
  editMessage() {
    const messageDto : MessageDto = {
      groupId: this.groupId,
      id: this.id,
      message: this.editableMessage.trim(),
      timestamp: this.timestamp,
      userId: this.userId,
      userName: this.userName,
      isEdited : true
    }

    this.messagesService.editMessage(messageDto)
      .pipe(
        catchError(error => {
          return throwError(() => error)
        }),
        finalize(() => {
          this.isEditing = false
        })
        )
      .subscribe({
        next: (result) => {
          this.applicationHubService
            .editMessage(messageDto)
            .then(() => {
              this.toast.success({detail:"Success", summary: result.message, duration:3000})
            })
        }
    })
  }

  /**
   * Description: onDelete method opens the confirmation pop-up for deleting the message
   * @memberOf MessageComponent
   */
  onDelete() {
    this.dialog.open(ConfirmMessageDeleteComponent, {
      data: {
        id: this.id,
        userId: this.userId,
        groupId: this.groupId
      }
    })
  }
}
