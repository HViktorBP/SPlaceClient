import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {MessageDTO} from "../interfaces/message-dto";
import * as signalR from "@microsoft/signalr";
import {forkJoin} from "rxjs";
import {UsersDataService} from "./users-data.service";
import {NgToastService} from "ng-angular-popup";

@Injectable({
  providedIn: 'root'
})
export class GroupHubService {
  public baseUrl = "https://localhost:7149/api/Chat/"

  public connection : signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7149/group")
    .configureLogging(signalR.LogLevel.Information)
    .build()
  public messages: any[] = []

  constructor(private http : HttpClient,
              private auth : UserService,
              private userData : UsersDataService,
              private toast : NgToastService) {
    this.start()

    this.connection.on("ReceiveMessage", (username: string, groupID:string, message: string, timespan: Date) => {
      this.messages = [...this.messages, {username, groupID, message, timespan}]
      this.userData.updateGroupMessages(this.messages)
      console.log(this.userData.groupMessages$)
    })
  }

  public async start() {
    try {
      await this.connection.start()
    } catch (e) {
      this.toast.error({detail:"Error", summary:"Couldn't establish a connection with group!", duration: 3000})
    }
  }

  public async joinChat(username: string, group: string) {
    return this.connection.invoke("JoinChat", {username, group})
  }

  public async sendMessage(message: string, group: string, date: Date){
    return this.connection.invoke("SendMessage", message, group, date)
  }

  public async removeUserFromGroup(username: string, groupID: string) {
    return this.connection.invoke('RemoveUserFromGroup', username, groupID)
  }

  public async leaveChat() {
    return this.connection.stop()
  }

  public getMessages(groupID: number) {
    this.messages.length = 0
    this.userData.updateGroupMessages([])
    return this.http.get<MessageDTO[]>(`${this.baseUrl}get-messages-in-group?groupID=${groupID}`).subscribe(result => {
      const observables = result.map(m => this.auth.getUserByID(m.userID))
      forkJoin(observables).subscribe(users => {
        result.forEach((m, index) => {
          const username = users[index].username
          this.messages = [...this.messages, { username, groupID: +m.groupID, message: m.message, timespan: m.timespan }]
        })
        this.userData.updateGroupMessages(this.messages)
      })
    })
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
