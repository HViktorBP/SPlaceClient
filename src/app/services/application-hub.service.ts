import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import {GroupDataService} from "../states/group-data.service";
import {MessageDto} from "../dtos/message/message-dto";

@Injectable({
  providedIn: 'root'
})

export class ApplicationHubService {
  public connection : signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7149/application")
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect([0, 2000, 10000, 30000])
    .build()

  public messages: any[] = []

  constructor(private groupDataService : GroupDataService) {

      this.connection.on("MessageSent", (messageDto : MessageDto) => {
        const groupId = this.groupDataService.currentGroupId

        if (groupId == messageDto.groupId) {
          this.messages = [...this.groupDataService.groupMessages, messageDto]
          this.groupDataService.updateGroupMessages(this.messages)
        }
      })
  }

  public async start() {
    await this.connection.start()
    console.log("You are in the app now!")
  }

  public async leave() {
    return this.connection.stop()
  }

  public async sendMessage(message : MessageDto){
    return this.connection.invoke("SendMessage", message)
  }

  public async setGroupConnection(groupId : number){
    return this.connection.invoke("SetGroupConnection", groupId)
  }

  public async addUserConnection(userName : string){
    console.log("Id that will be connected :" +this.connection.connectionId)
    return this.connection.invoke("AddUserConnection", userName)
  }
}
