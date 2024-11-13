import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SaveMessageRequest} from "../data-transferring/contracts/message/save-message-request";
import {MessageDto} from "../data-transferring/dtos/message/message-dto";
import {DeleteMessageRequest} from "../data-transferring/contracts/message/delete-message-request";
import {catchError, throwError} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

/**
 * MessagesService is responsible for managing message-related operations, including
 * creating, updating, and deleting message data by communicating with the backend API.
 */

export class MessagesService {
  /**
   * baseUrl is the endpoint used to communicate with the server for message-related operations.
   * @private
   */
  private baseUrl:string = environment.apiUrl + 'Messages/'

  constructor(private http : HttpClient) { }

  /**
   * saveMessage method sends HTTP request to save the message to database.
   * @param saveMessagePayload - data needed for message to be saved.
   */
  saveMessage(saveMessagePayload: SaveMessageRequest) {
    return this.http.post<MessageDto>(`${this.baseUrl}save`, saveMessagePayload).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * editMessage method sends HTTP request to edit the message.
   * @param editMessage - edited message.
   */
  editMessage(editMessage : MessageDto) {
    return this.http.put<any>(`${this.baseUrl}edit`, editMessage).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * deleteMessage method sends HTTP request to delete the message.
   * @param deleteMessagePayload - data needed for message to be deleted.
   */
  deleteMessage(deleteMessagePayload : DeleteMessageRequest) {
    return this.http.delete<any>(`${this.baseUrl}delete`, {"body": deleteMessagePayload}).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }
}
