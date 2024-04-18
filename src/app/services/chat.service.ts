import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthorisationService} from "./authorisation.service";
import {MessageDTO} from "../interfaces/message-dto";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public baseUrl = "https://localhost:7149/api/Chat/"
  public auth = inject(AuthorisationService)

  constructor(private http : HttpClient) {

  }

  public getMessages(groupID: number) {
    return this.http.get<MessageDTO[]>(`${this.baseUrl}get-messages-in-group?groupID=${groupID}`)
  }

  public saveMessage(userID: number, groupID: number, message: string, timespan: Date){
    const messageToSend : MessageDTO = {
      userID: userID,
      groupID: groupID,
      message: message,
      timespan: timespan
    }
    return this.http.post<any>(`${this.baseUrl}save-message`, messageToSend)
  }

}
