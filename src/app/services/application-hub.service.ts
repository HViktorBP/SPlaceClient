import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import {UserService} from "./user.service";
import {GroupsService} from "./groups.service";
import {NgToastService} from "ng-angular-popup";
import {UsersDataService} from "./users-data.service";
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {User} from "../dtos/user";
import {GroupHubService} from "./group-hub.service";

@Injectable({
  providedIn: 'root'
})
export class ApplicationHubService {
  public connection : signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7149/application")
    .configureLogging(signalR.LogLevel.Information)
    .build()

  constructor(private auth : UserService,
              private group : GroupsService,
              private toast : NgToastService,
              private userData : UsersDataService,
              private groupHub : GroupHubService) {

    this.connection.on("NewUserAdded", (userID : string, groupID : string) => {
      this.auth.getUserID(this.auth.getUsername()).subscribe({
        next : userIDCurrent => {
          this.group.getGroupById(+groupID).subscribe({
            next:groupName => {
              if (userIDCurrent == +userID) {
                this.groupHub.joinChat(this.auth.getUsername(), groupID.toString()).then(() => {
                  this.userData.updateGroupsList(this.auth.getUsername())
                  this.toast.info({detail: "Info", summary: `You have been added to the ${groupName}!`, duration: 3000})
                })
              }
            },
            error : err => {
              this.toast.error({detail: "Error", summary: err.error.message, duration: 3000})
            }
          })
        },
        error : err => {
          this.toast.error({detail: "Error", summary: err.error.message, duration: 3000})
        }
      })
    })

    this.connection.on("UserChangedTheName", (id : number) => {
      if (this.userData.getUserCurrentGroupId != 0) {
        this.group.getUsersInGroup(this.userData.getUserCurrentGroupId).pipe(
          switchMap(usersID => {
            const observables: Observable<User>[] = usersID.map(id => this.auth.getUserByID(id))
            return forkJoin(observables).pipe(
              map(usersData => usersData.map(user => user.username))
            )
          })
        ).subscribe(users => {
          this.userData.updateUsersList(users)
        })
      }
    })
  }

  public async start() {
    try {
      await this.connection.start()
      console.log("You are in the app now!")
    } catch (e) {
      console.log(e)
      setTimeout(() => {
        this.start()
      }, 6000)
    }
  }

  public async leave() {
    return this.connection.stop()
  }
}
