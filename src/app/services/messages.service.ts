import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SaveMessage} from "../contracts/message/save-message";
import {MessageDto} from "../dtos/message/message-dto";
import {DeleteMessage} from "../contracts/message/delete-message";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private baseUrl:string = "https://localhost:7149/api/Messages/"

  constructor(private http : HttpClient) { }

  saveMessage(message: SaveMessage) {
    return this.http.post<MessageDto>(`${this.baseUrl}save`, message)
  }

  editMessage(message : MessageDto) {
    return this.http.put<string>(`${this.baseUrl}edit`, message)
  }

  deleteMessage(message : DeleteMessage) {
    return this.http.delete<string>(`${this.baseUrl}delete`, {"body": message})
  }
}
