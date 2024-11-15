import {Component, Inject, inject, OnInit} from '@angular/core';
import {MessagesService} from "../../../../../../../services/messages.service";
import {DeleteMessageRequest} from "../../../../../../../data-transferring/contracts/message/delete-message-request";
import {catchError, take, throwError} from "rxjs";
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {ApplicationHubService} from "../../../../../../../services/application-hub.service";
import {ActivatedRoute} from "@angular/router";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-confirm-message-delete',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ],
  templateUrl: './confirm-message-delete.component.html',
  styleUrl: './confirm-message-delete.component.scss'
})
export class ConfirmMessageDeleteComponent {
  public dialogRef = inject(MatDialogRef<ConfirmMessageDeleteComponent>)

  constructor(private messagesService : MessagesService,
              private applicationHubService : ApplicationHubService,
              private toast: NgToastService,
              @Inject(MAT_DIALOG_DATA) public data: any
              ) {

  }

  /**
   * Description: deleteMessage deletes calls the HTTP request for deleting the message and handles the UI according to the request's result.
   * @memberOf MessageComponent
   */
  deleteMessage() {
    const deleteMessageRequest : DeleteMessageRequest = {
      userId: this.data.userId,
      groupId: this.data.groupId,
      messageId: this.data.id
    }

    this.messagesService.deleteMessage(deleteMessageRequest)
      .pipe(
        take(1),
        catchError(error => {
          return throwError(() => error)
        })
      )
      .subscribe({
        next: (result) => {
          this.applicationHubService
            .deleteMessage(deleteMessageRequest.groupId, deleteMessageRequest.messageId)
            .then(() => {
              this.toast.success({detail:"Success", summary: result.message, duration:3000})
            })
            .finally(() => {
              this.dialogRef.close()
            })
        }
      })
  }
}
