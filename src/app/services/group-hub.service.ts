import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UsersService} from "./users.service";
import {MessageDto} from "../dtos/message/message-dto";
import * as signalR from "@microsoft/signalr";
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {UsersDataService} from "../states/users-data.service";
import {NgToastService} from "ng-angular-popup";
import {QuizzesService} from "./quizzes.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {User} from "../dtos/user";
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
  // public messages: any[] = []
  // constructor(private http : HttpClient,
  //             private auth : UsersService,
  //             private userData : UsersDataService,
  //             private toast : NgToastService,
  //             private quizzes : QuizzesService,
  //             private group : GroupsService,
  //             private modal : NgbModal,
  //             private router : Router) {
  //
  //   this.connection.on("ReceiveMessage", (username: string, groupID:string, message: string, timespan: Date) => {
  //     if (+groupID == this.userData.getUserCurrentGroupId) {
  //       this.messages = [...this.messages, {username, groupID, message, timespan}]
  //       this.userData.updateGroupMessages(this.messages)
  //     }
  //   })
  //
  //   this.connection.on('NewUserAdded', (userID : number, groupID : number) => {
  //     this.auth.getUserByID(userID).subscribe(user => {
  //       this.group.getGroupById(groupID).subscribe(groupName => {
  //         this.toast.info({detail: "Info", summary: `${user.username} was added to the ${groupName}!`, duration: 3000})
  //       })
  //     })
  //
  //     if (this.userData.getUserCurrentGroupId == groupID)
  //       this.updateUsersInGroup(groupID)
  //   })
  //
  //   this.connection.on("NewQuizAdded", (groupID:number, name:string) => {
  //     this.group.getGroupById(groupID).subscribe(groupName => {
  //       this.toast.info({detail: "Info", summary: `New quiz-list(${name}) has been added to ${groupName}!`, duration: 3000})
  //     })
  //
  //     if (this.userData.getUserCurrentGroupId == groupID) {
  //       this.quizzes.getQuizzesInGroup(groupID).subscribe({
  //         next:quizzesList=> {
  //           this.userData.updateQuizzesList(quizzesList)
  //         },
  //         error:err => {
  //           this.toast.error({detail: "Error", summary: err.error.message, duration: 3000})
  //         }
  //       })
  //     }
  //   })
  //
  //   this.connection.on("QuizRemoved", (name:string, groupID:number) => {
  //     this.group.getGroupById(groupID).subscribe(groupName => {
  //       this.toast.info({detail: "Info", summary: `Quiz(${name}) has been deleted from ${groupName}!`, duration: 3000})
  //     })
  //
  //     if (this.userData.getUserCurrentGroupId == groupID) {
  //       if (sessionStorage.getItem('quiz-list') == name)
  //         this.modal.dismissAll()
  //
  //       this.quizzes.getQuizzesInGroup(groupID).subscribe({
  //         next:quizzesList=> {
  //           this.userData.updateQuizzesList(quizzesList)
  //         },
  //         error:err => {
  //           this.toast.error({detail: "Error", summary: err.error.message, duration: 3000})
  //         }
  //       })
  //     }
  //   })
  //
  //   this.connection.on("UserLeftGroup", (groupID : number) => {
  //     if (groupID == this.userData.getUserCurrentGroupId) {
  //       this.updateUsersInGroup(groupID)
  //       this.getMessages(groupID)
  //     }
  //   })
  //
  //   this.connection.on("UserDeleted", (userID : number, groupID : number) => {
  //     this.auth.getUserByID(userID).subscribe(user => {
  //       this.group.getGroupById(groupID).subscribe(groupName => {
  //         if (user.username == this.auth.getUsername()) {
  //           if (groupID == this.userData.getUserCurrentGroupId)
  //             this.router.navigate(['/main/home'])
  //
  //           this.toast.info({detail: "Info", summary: `You was removed from ${groupName}!`, duration: 3000})
  //           this.userData.updateGroupsList(this.auth.getUsername())
  //         }
  //         else if (groupID == this.userData.getUserCurrentGroupId) {
  //           this.updateUsersInGroup(groupID)
  //           this.getMessages(groupID)
  //         } else {
  //           this.toast.info({detail: "Info", summary: `${user.username} was removed from ${groupName}!`, duration: 3000})
  //         }
  //       })
  //     })
  //   })
  //
  //   this.connection.on("GroupDeleted", (groupID : number) => {
  //     if (groupID == this.userData.getUserCurrentGroupId)
  //       this.router.navigate(['/main/home'])
  //
  //     this.userData.userGroupData$.subscribe(groupData => {
  //       const exists = groupData.find(group => group.id == groupID)?.name
  //       if (exists != undefined) {
  //         this.userData.updateGroupsList(this.auth.getUsername())
  //         this.toast.info({detail:"Info", summary: `Group ${exists} was deleted!`, duration: 3000})
  //       }
  //     })
  //   })
  // }
  //
  // public async start() {
  //   if (this.connection.state == signalR.HubConnectionState.Disconnected) {
  //     try {
  //       await this.connection.start()
  //       console.log("You are in the group now!")
  //
  //     } catch (e) {
  //       console.log(e)
  //       setTimeout(() => {
  //         this.start()
  //       }, 6000)
  //     }
  //   }
  // }
  //
  // public async joinChat(username: string, groupID: string) {
  //   return this.connection.invoke("JoinChat", username, groupID)
  // }
  //
  // public async sendMessage(username: string, groupID: string, message: string, date: Date){
  //   return this.connection.invoke("SendMessage", username, groupID, message, date)
  // }
  //
  // public async removeUserFromGroup(username: string, groupID: string) {
  //   return this.connection.invoke('RemoveUserFromGroup', username, groupID)
  // }
  //
  // public async deleteGroup(groupID: number) {
  //   return this.connection.invoke('DeleteGroup', groupID.toString())
  // }
  //
  // public async leaveChat(groupID : string) {
  //   return this.connection.invoke("LeaveChat", groupID)
  // }
  //
  // public async leave() {
  //   return this.connection.stop()
  // }
  //
  // public getMessages(groupID: number) {
  //   this.messages.length = 0
  //   this.userData.updateGroupMessages([])
  //   return this.http.get<MessageDTO[]>(`${this.baseUrl}get-messages-in-group?groupID=${groupID}`).subscribe(result => {
  //     const observables = result.map(m => this.auth.getUserByID(m.userID))
  //     forkJoin(observables).subscribe(users => {
  //       result.forEach((m, index) => {
  //         const username = users[index].username
  //         this.messages = [...this.messages, { username, groupID: +m.groupID, message: m.message, timespan: m.timespan }]
  //       })
  //       this.userData.updateGroupMessages(this.messages)
  //     })
  //   })
  // }
  //
  // public saveMessage(userID: number, groupID: number, message: string, timespan: Date){
  //   const messageToSend : MessageDTO = {
  //     userID: userID,
  //     groupID: groupID,
  //     message: message,
  //     timespan: timespan
  //   }
  //   return this.http.post<any>(`${this.baseUrl}save-message`, messageToSend)
  // }
  //
  // private updateUsersInGroup(groupID:number) {
  //   this.group.getUsersInGroup(groupID).pipe(
  //     switchMap(usersID => {
  //       const observables: Observable<User>[] = usersID.map(id => this.auth.getUserByID(id))
  //       return forkJoin(observables).pipe(
  //         map(usersData => usersData.map(user => user.username))
  //       )
  //     })
  //   ).subscribe(userUsernames => {
  //     this.userData.updateUsersList(userUsernames);
  //     this.userData.updateUserCount(userUsernames.length);
  //   })
  // }
}
