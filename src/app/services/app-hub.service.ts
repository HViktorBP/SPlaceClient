import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import {UserService} from "./user.service";
import {GroupsService} from "./groups.service";
import {NgToastService} from "ng-angular-popup";
import {UsersDataService} from "./users-data.service";
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {User} from "../interfaces/user";
import {GroupHubService} from "./group-hub.service";
import {Router} from "@angular/router";

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
              private userData : UsersDataService,
              private groupHub : GroupHubService,
              private router : Router) {
    this.start()

    this.connection.on("NewUserAdded", (userID : string, groupID : string) => {
      this.auth.getUserID(this.auth.getUsername()).subscribe({
        next : userIDCurrent => {
          this.group.getGroupById(+groupID).subscribe({
            next:groupName => {
              this.userData.groupId$.subscribe(groupIdCurrent => {
                if (userIDCurrent == +userID) {
                  this.toast.info({detail: "Info", summary: `You have been added to the ${groupName}!`, duration: 3000})
                  this.userData.updateGroup(this.auth.getUsername())
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

    this.connection.on("UserDeletedFromTheGroup", (userID : string, groupID : string) => {
      this.auth.getUserID(this.auth.getUsername()).subscribe({
        next : userIDCurrent => {
          this.group.getGroupById(+groupID).subscribe({
            next:groupName => {
              this.userData.groupId$.subscribe(groupIdCurrent => {
                if (userIDCurrent == +userID) {
                  this.toast.info({detail: "Info", summary: `You have been removed from the ${groupName}!`, duration: 3000})
                  this.groupHub.leaveChat().then(
                    () => {
                      this.userData.updateGroup(this.auth.getUsername())
                      this.router.navigate(['main/home']).then(
                        () => {
                          this.toast.info({detail: "Info", summary: `You was removed from the group!`})
                          this.userData.updateGroup(this.auth.getUsername())
                        }
                      )
                    }
                  )
                } else if (+groupID == groupIdCurrent) {
                  this.auth.getUserByID(+userID).subscribe({
                    next:user => {
                      this.toast.info({detail: "Info", summary: `${user.username} was removed from this group`, duration: 3000})
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

  public async leave() {
    return this.connection.stop()
  }
}
