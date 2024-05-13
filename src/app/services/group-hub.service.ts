import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {MessageDTO} from "../interfaces/message-dto";
import * as signalR from "@microsoft/signalr";
import {BehaviorSubject, forkJoin} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {UsersDataService} from "./users-data.service";
import {NgToastService} from "ng-angular-popup";
import {GroupsService} from "./groups.service";

@Injectable({
  providedIn: 'root'
})
export class GroupHubService {
  public baseUrl = "https://localhost:7149/api/Chat/"

  public connection : signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7149/group")
    .configureLogging(signalR.LogLevel.Information)
    .build()
  public messages$ = new BehaviorSubject<any>([])
  public messages: any[] = []

  constructor(private http : HttpClient,
              private auth : UserService,
              private route : ActivatedRoute,
              private group : GroupsService,
              private userData : UsersDataService,
              private router : Router,
              private toast : NgToastService) {
    this.start()

    this.connection.on("ReceiveMessage", (username: string, groupID:string, message: string, timespan: Date) => {
      this.messages = [...this.messages, {username, groupID, message, timespan}]
      this.userData.updateGroupMessages(this.messages)
      console.log(this.userData.groupMessages$)
    })

    this.connection.on("UserRemovedFromGroup", (username: string, groupID:string) => {
      const usernameUser = this.auth.getUsername()
      this.userData.groupId$.subscribe(groupIDUser => {
        if (usernameUser == username && groupIDUser == +groupID) {
          this.router.navigate(['main/home']).then(res => {
            this.leaveChat().then(() => this.toast.info({detail: "Info", summary: `You was removed from the group!`}))
          })
          this.userData.updateGroup(this.auth.getUsername())
        } else if (groupIDUser == +groupID) {
          this.group.getGroupById(groupIDUser).subscribe({
            next:group => {
              this.toast.info({detail: "Info", summary: `${username} removed from the ${group}!`})
            }
          })
        }
      })
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
