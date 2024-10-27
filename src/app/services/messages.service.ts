import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SaveMessageRequest} from "../data-transferring/contracts/message/save-message-request";
import {MessageDto} from "../data-transferring/dtos/message/message-dto";
import {DeleteMessageRequest} from "../data-transferring/contracts/message/delete-message-request";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private baseUrl:string = "https://localhost:7149/api/Messages/"

  constructor(private http : HttpClient) { }

  saveMessage(message: SaveMessageRequest) {
    return this.http.post<MessageDto>(`${this.baseUrl}save`, message)
  }

  editMessage(message : MessageDto) {
    return this.http.put<string>(`${this.baseUrl}edit`, message)
  }

  deleteMessage(message : DeleteMessageRequest) {
    return this.http.delete<string>(`${this.baseUrl}delete`, {"body": message})
  }
}
