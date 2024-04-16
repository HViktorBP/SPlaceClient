import {inject, Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {BehaviorSubject, forkJoin} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthorisationService} from "./authorisation.service";
import {MessageDTO} from "../interfaces/message-dto";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public connection : signalR.HubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7149/chat")
      .configureLogging(signalR.LogLevel.Information)
      .build()
  public baseUrl = "https://localhost:7149/api/Chat/"
  public messages$ = new BehaviorSubject<any>([])
  public messages: any[] = []
  public auth = inject(AuthorisationService)

  constructor(private http: HttpClient) {
    this.start()
    this.connection.on("ReceiveMessage", (username: string, groupID:string, message: string, timespan: Date) => {
      this.messages = [...this.messages, {username, groupID, message, timespan}]
      this.messages$.next(this.messages)
    })
  }

  public async start() {
    try {
      await this.connection.start()
      console.log("Connection is established")

      this.getMessages().subscribe(result => {
        const observables = result.map(m => this.auth.getUserByID(m.userID));
        forkJoin(observables).subscribe(users => {
          result.forEach((m, index) => {
            const username = users[index].username;
            console.log(m.message)
            this.messages = [...this.messages, { username, groupID: +m.groupID, message: m.message, timespan: m.timespan }];
          });
          this.messages$.next(this.messages);
        });
      });

    } catch (e) {
      console.log(e)
      setTimeout(() => {
        this.start()
      }, 6000)
    }
  }

  public async joinChat(username: string, group: string) {
    return this.connection.invoke("JoinChat", {username, group})
  }

  public async sendMessage(message: string, group: string, date: Date){
    return this.connection.invoke("SendMessage", message, group, date)
  }

  public getMessages() {
    return this.http.get<MessageDTO[]>(`${this.baseUrl}get-messages-in-group`)
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

  public async leaveChat() {
    return this.connection.stop()
  }
}
