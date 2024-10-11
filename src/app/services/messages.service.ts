import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {SaveMessage} from "../contracts/message/save-message";
import {MessageDto} from "../dtos/message/message-dto";

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private baseUrl:string = "https://localhost:7149/api/Messages/"

  constructor(private http : HttpClient) { }

  saveMessage(message: SaveMessage) {
    return this.http.post<MessageDto>(`${this.baseUrl}save`, message)
  }
}
