import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import {UserService} from "./user.service";
import {GroupsService} from "./groups.service";
import {NgToastService} from "ng-angular-popup";
import {UsersDataService} from "./users-data.service";
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {User} from "../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class AppHubService {
  public connection : signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7149/app")
    .configureLogging(signalR.LogLevel.Information)
    .build()
  constructor(private auth : UserService,
              private group : GroupsService,
              private toast : NgToastService,
              private userData : UsersDataService) {

    this.connection.on("NewUserAdded", (userID : string, groupID : string) => {
      this.auth.getUserID(this.auth.getUsername()).subscribe({
        next : userIDCurrent => {
          this.group.getGroupById(+groupID).subscribe({
            next:groupName => {
              this.userData.groupId$.subscribe(groupIdCurrent => {
                if (userIDCurrent == +userID) {
                  this.userData.updateGroupsList(this.auth.getUsername())
                  this.toast.info({detail: "Info", summary: `You have been added to the ${groupName}!`, duration: 3000})
                } else if (+groupID == groupIdCurrent) {
                  this.auth.getUserByID(+userID).subscribe({
                    next:user => {
                      this.toast.info({detail: "Info", summary: `${user.username} was added to this group!`, duration: 3000})
                    }
                  })
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

    this.connection.on("UserChangedTheName", (username : string) => {
      this.userData.groupId$.subscribe(groupIdCurrent => {
        if (groupIdCurrent != 0) {
          this.group.getUsersInGroup(groupIdCurrent).pipe(
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
    })

    this.connection.on("UserDeleted", (userID : string, groupID : number) => {
      this.userData.groupId$.subscribe(groupIDCurrent => {
        this.auth.getUserID(this.auth.getUsername()).subscribe(userIDCurrent => {
          if (+userID == userIDCurrent) {
            this.userData.updateGroupsList(this.auth.getUsername())
            this.group.getGroupById(groupID).subscribe({
              next:groupName => {
                this.toast.info({detail:"Info", summary: `You was removed from ${groupName}`, duration: 3000})
              }
            })

            if (groupIDCurrent == groupID)
              window.location.href = '/main/home';
          }
        })
      })
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
