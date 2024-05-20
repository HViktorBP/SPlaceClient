import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserService} from "./user.service";
import {MessageDTO} from "../interfaces/message-dto";
import * as signalR from "@microsoft/signalr";
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {UsersDataService} from "./users-data.service";
import {NgToastService} from "ng-angular-popup";
import {QuizzesService} from "./quizzes.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../interfaces/user";
import {GroupsService} from "./groups.service";
import {Router} from "@angular/router";

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
              private toast : NgToastService,
              private quizzes : QuizzesService,
              private group : GroupsService,
              private router : Router,
              private modal : NgbModal) {
    this.connection.on("ReceiveMessage", (username: string, groupID:string, message: string, timespan: Date) => {
      this.messages = [...this.messages, {username, groupID, message, timespan}]
      this.userData.updateGroupMessages(this.messages)
    })

    this.connection.on("NewQuizAdded", (groupID:number, name:string) => {
      this.userData.groupId$.subscribe(groupIdCurrent => {
        if (groupID == groupIdCurrent) {
          this.quizzes.getQuizzesInGroup(groupID).subscribe({
            next:quizzesList=> {
              this.userData.updateQuizzesList(quizzesList)
              this.toast.info({detail: "Info", summary: `New quiz(${name}) has been added to this group!`, duration: 3000})
            },
            error:err => {
              this.toast.error({detail: "Error", summary: err.error.message, duration: 3000})
            }
        })
        }
      })
    })

    this.connection.on("QuizRemoved", (name:string, groupID:number) => {
      this.userData.groupId$.subscribe(groupIdCurrent => {
        if (groupID == groupIdCurrent) {
          if (sessionStorage.getItem('quiz') == name) {
            this.modal.dismissAll()
          }

          this.quizzes.getQuizzesInGroup(groupIdCurrent).subscribe({
            next:quizzesList=> {
              this.userData.updateQuizzesList(quizzesList)
              this.toast.info({detail: "Info", summary: `${name} was deleted!`, duration: 3000})
            },
            error:err => {
              this.toast.error({detail: "Error", summary: err.error.message, duration: 3000})
            }
          })
        }
      })
    })

    this.connection.on("UserDeletedFromTheGroup", (username : string, groupID : string) => {
      this.userData.groupId$.subscribe(groupIdCurrent => {
        console.log("Hello")
        if (groupIdCurrent == +groupID) {
          this.toast.info({detail: "Info", summary: `${username} was removed from this group`, duration: 3000})
          this.getMessages(+groupID)
          this.group.getUsersInGroup(+groupID).pipe(
            switchMap(usersID => {
              const observables: Observable<User>[] = usersID.map(id => this.auth.getUserByID(id))
              return forkJoin(observables).pipe(
                map(usersData => usersData.map(user => user.username))
              )
            })
          ).subscribe(userUsernames => {
            this.userData.updateUsersList(userUsernames);
            this.userData.updateUserCount(userUsernames.length);
          })
        }
      })
    })

    this.connection.on("UserLeftGroup", (groupID : number) => {
      this.userData.groupId$.subscribe(groupIDCurrent => {
        if (groupIDCurrent == groupID) {
          this.group.getUsersInGroup(+groupID).pipe(
            switchMap(usersID => {
              const observables: Observable<User>[] = usersID.map(id => this.auth.getUserByID(id))
              return forkJoin(observables).pipe(
                map(usersData => usersData.map(user => user.username))
              )
            })
          ).subscribe(userUsernames => {
            this.userData.updateUsersList(userUsernames);
            this.userData.updateUserCount(userUsernames.length);
          })
        }
      })
    })
  }

  public async start() {
    if (this.connection.state == signalR.HubConnectionState.Disconnected) {
      try {
        await this.connection.start()
        console.log("You are in the group now!")

      } catch (e) {
        console.log(e)
        setTimeout(() => {
          this.start()
        }, 6000)
      }
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

  public async leave() {
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
