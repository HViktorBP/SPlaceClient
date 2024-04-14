import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  public connection : signalR.HubConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7149/chat")
      .configureLogging(signalR.LogLevel.Information)
      .build()

  public messages$ = new BehaviorSubject<any>([])
  public connectedUsers$ = new BehaviorSubject<string[]>([])
  public messages: any[] = []
  public connectedUsers: string[] =[]
  constructor() {
    this.start()
    this.connection.on("ReceiveMessage", (user: string, message: string, messageTime: string) => {

      this.messages = [...this.messages, {user, message, messageTime}]
      this.messages$.next(this.messages)
    })

    this.connection.on("ConnectedUser", (users: any) => {
      this.connectedUsers$.next(users)
    })
  }

  public async start() {
    try {
      await this.connection.start()
      console.log("Connection is established")
    } catch (e) {
      console.log(e)
      setTimeout(() => {
        this.start()
      }, 6000)
    }
  }

  public async joinChat(username: string, room: string) {
    console.log(username, room)
    return this.connection.invoke("JoinChat", {username, room})
  }

  public async sendMessage(message: string){
    return this.connection.invoke("SendMessage", message)
  }

  public async leaveChat() {
    return this.connection.stop()
  }


}
