import {Injectable} from '@angular/core';
import * as signalR from "@microsoft/signalr";
import {GroupDataService} from "../states/group-data.service";
import {MessageDto} from "../data-transferring/dtos/message/message-dto";
import {UsersDataService} from "../states/users-data.service";
import {UsersService} from "./users.service";
import {GroupsService} from "./groups.service";
import {take, tap} from "rxjs";
import {map} from "rxjs/operators";
import {NgToastService} from "ng-angular-popup";
import {ActivatedRoute, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class ApplicationHubService {
  private connection : signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7149/application")
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build()

  private messages: MessageDto[] = []

  constructor(private groupDataService : GroupDataService,
              private usersDataService : UsersDataService,
              private usersService : UsersService,
              private groupService : GroupsService,
              private toast : NgToastService,
              private router : Router,
              private route : ActivatedRoute) {

    //#region Message
    this.connection.on("MessageSent", (messageDto : MessageDto) => {
      const groupId = this.groupDataService.currentGroupId

      if (groupId == messageDto.groupId) {
        this.messages = [...this.groupDataService.groupMessages, messageDto]
        this.groupDataService.updateGroupMessages(this.messages)
      }
    })

    this.connection.on("MessageEdited", (messageDto : MessageDto) => {
      const groupId = this.groupDataService.currentGroupId

      if (groupId == messageDto.groupId) {
        this.messages = [...this.groupDataService.groupMessages]
        this.groupDataService.updateMessage(messageDto)
      }
    })

    this.connection.on("MessageDeleted", (groupId : number, messageId : number) => {
      if (this.groupDataService.currentGroupId === groupId) {
        this.groupDataService.deleteMessage(messageId);
      }
    })
    //#endregion

    //#region User
    this.connection.on("UsernameUpdated", () => {
      this.usersService.getUserAccount(this.usersService.getUserId())
        .pipe(
          take(1),
          tap(user => {
            this.usersDataService.updateUsername(user.username)
          })
        )
        .subscribe({
          error : err => {
            this.toast.error({detail:"Error", summary: err, duration:3000})
          }
        })
    })
    //#endregion

    //#region Group
    this.connection.on("AddedToGroup", (groupId : number) => {
      this.usersService.getUserAccount(this.usersService.getUserId())
        .pipe(
          take(1),
          tap(user => {
            this.usersDataService.updateGroupData(user.groups)
          }),
          map (user => user.groups)
          )
        .subscribe({
          next : (groups) => {
            const groupName = groups.find(g => g.id == groupId)?.name
            this.toast.success({detail:"Info", summary: `You have been added to the ${groupName}!`, duration:3000})
          },
          error: err => {
            this.toast.error({detail:"Error", summary: err, duration:3000})
          }
        })
    })

    this.connection.on("UpdateParticipants", (groupId : number) => {
      if (this.groupDataService.currentGroupId == groupId) {
        this.groupService.getGroup(groupId)
          .pipe(
            take(1),
            tap(group => {
              this.groupDataService.updateUsersList(group.users)
              this.groupDataService.updateUserCount(group.users.length)
            })
          )
          .subscribe({
            error : err => {
              this.toast.error({detail:"Error", summary: err, duration:3000})
            }
          })
      }
    })

    this.connection.on("LeftTheGroup", (user : string, groupId : number) => {
      if (this.groupDataService.currentGroupId == groupId)
        this.toast.info({detail:"Info", summary: `${user} left the group!`, duration:3000})
    })

    this.connection.on("UpdateMessages", (groupId : number) => {
      if (this.groupDataService.currentGroupId == groupId) {
        this.groupService.getGroup(groupId)
          .pipe(
            take(1),
            tap(group => {
              this.groupDataService.updateGroupMessages(group.messages)
            })
          )
          .subscribe({
            error : err => {
              this.toast.error({detail:"Error", summary: err, duration:3000})
            }
          })
      }
    })

    this.connection.on("RemovedFromTheGroup", (groupId : number) => {
      this.usersService.getUserAccount(this.usersService.getUserId())
        .pipe(
          take(1),
          tap(user => {
            this.usersDataService.updateGroupData(user.groups)
            this.usersDataService.updateUserScores(user.scores)
          })
        )
        .subscribe({
          next : () => {
            if (this.groupDataService.currentGroupId == groupId) {
              this.toast.success({detail:"Info", summary: `You have been removed from this group!`, duration:3000})
              this.router.navigate(['main']).catch(
                err => {
                  this.toast.error({detail:"Error", summary: err, duration:3000})
                }
              )
            }
          },
          error: err => {
            this.toast.error({detail:"Error", summary: err, duration:3000})
          }
        })
    })

    this.connection.on("GroupDeleted", (groupId : number) => {
      this.usersService.getUserAccount(this.usersService.getUserId())
        .pipe(
          take(1),
          tap(user => {
            this.usersDataService.updateGroupData(user.groups)
          })
        )
        .subscribe({
          next : () => {
            if (this.groupDataService.currentGroupId == groupId) {
              this.toast.info({detail:"Info", summary: `Group has been deleted!`, duration:3000})
              this.router.navigate(['main']).catch(
                err => {
                  this.toast.error({detail:"Error", summary: err, duration:3000})
                }
              )
            }
          },
          error: err => {
            this.toast.error({detail:"Error", summary: err, duration:3000})
          }
        })
    })

    this.connection.on("RoleChanged", (groupId : number, role : string) => {
      if (this.groupDataService.currentGroupId == groupId) {
        this.groupService.getRole(this.usersService.getUserId(), groupId)
          .pipe(
            take(1),
            tap(role => {
              this.groupDataService.updateUserRole(role)
            })
          ).subscribe({
            next : () => {
              this.toast.info({detail:"Info", summary: `You are now promoted to ${role}`, duration:3000})
            },
            error : err => {
              this.toast.error({detail:"Error", summary: err, duration:3000})
            }
        })
      }
    })

    this.connection.on("GroupRenamed", (groupId : number) => {
      this.usersService.getUserAccount(this.usersService.getUserId())
        .pipe(
          take(1),
          tap(user => this.usersDataService.updateGroupData(user.groups))
        )
        .subscribe({
          error : err => {
            this.toast.error({detail:"Error", summary: err, duration:3000})
          }
        })

      if (this.groupDataService.currentGroupId == groupId) {
        this.groupService.getGroup(groupId)
          .pipe(
            take(1),
            tap(group => {
              this.groupDataService.updateGroupName(group.name)
            }),
            map(group => group.name)
          ).subscribe({
            next : (name) => {
              this.toast.info({detail:"Info", summary: `This group name changed to ${name}`, duration:3000})
            },
            error : err => {
              this.toast.error({detail:"Error", summary: err, duration:3000})
            }
          })
      }
    })
    //#endregion

    //#region Quiz
    this.connection.on("QuizEdited", (groupId : number, quizId : number) => {
      this.usersService.getUserAccount(this.usersService.getUserId())
        .pipe(
          take(1),
          tap(user => {
            this.usersDataService.updateUserScores(user.scores)
          })
        )
        .subscribe({
          error : err => {
            this.toast.error({detail:"Error", summary: err, duration:3000})
          }
        })

      if (this.groupDataService.currentGroupId == groupId) {
        const currentQuizId = this.route.snapshot.paramMap.get('quizId');

        this.groupService.getGroup(groupId)
          .pipe(
            take(1),
            tap(group => {
              this.groupDataService.updateGroupScores(group.scores)
            })
          )
          .subscribe({
            error : err => {
              this.toast.error({detail:"Error", summary: err, duration:3000})
            }
          })

        if (currentQuizId != null) {
          if (+currentQuizId == quizId) {
            this.router.navigate(['main/group' + groupId + 'chat'])
              .catch(err => {
                this.toast.error({detail:"Error", summary: err, duration:3000})
              })
          }
        }
      }
    })

    this.connection.on("UpdateQuizList", (groupId : number) => {
      if (this.groupDataService.currentGroupId == groupId) {
        this.groupService.getGroup(groupId)
          .pipe(
            take(1),
            tap(group => {
              this.groupDataService.updateQuizzesList(group.quizzes)
            })
            )
          .subscribe({
            error : err => {
              this.toast.error({detail:"Error", summary: err, duration:3000})
            }
          })
      }
    })

    this.connection.on("UpdateScores", (groupId : number) => {
      if (this.groupDataService.currentGroupId == groupId) {
        this.groupService.getGroup(groupId)
          .pipe(
            take(1),
            tap(group => {
              this.groupDataService.updateGroupScores(group.scores)
            })
          )
          .subscribe({
            error : err => {
              this.toast.error({detail:"Error", summary: err, duration:3000})
            }
          })
      }
    })

    this.connection.on("QuizDeleted", () => {
      this.usersService.getUserAccount(this.usersService.getUserId())
        .pipe(
          take(1),
          tap(user => {
            this.usersDataService.updateUserScores(user.scores)
          })
        )
        .subscribe({
          error : err => {
            this.toast.error({detail:"Error", summary: err, duration:3000})
          }
        })
    })
    //#endregion
  }

  public async start() {
    await this.connection.start()
    console.log("You are in the app now!")
  }

  public async leave() {
    return this.connection.stop()
  }

  public async setGroupConnection(groupId : number){
    return this.connection.invoke("SetGroupConnection", groupId)
  }

  public async addUserConnection(userName : string) {
    return this.connection.invoke("AddUserConnection", userName)
  }

  //region Messages
  public async sendMessage(message : MessageDto){
    return this.connection.invoke("SendMessage", message)
  }

  public async editMessage(message : MessageDto){
    return this.connection.invoke("EditMessage", message)
  }

  public async deleteMessage(groupId : number, messageId : number){
    return this.connection.invoke("DeleteMessage", groupId, messageId)
  }
  //endregion

  //region User
  public async changeName(newUserName : string){
    return this.connection.invoke("ChangeName", newUserName)
  }

  public async deleteUser(groupsToDelete : number[]){
    return this.connection.invoke("DeleteUser", groupsToDelete)
  }
  //endregion

  //region Group
  public async changeRole(userName : string, role : number, groupId : number){
    return this.connection.invoke("ChangeRole", userName, role, groupId)
  }

  public async renameGroup(groupId : number){
    return this.connection.invoke("RenameGroup", groupId)
  }

  public async addToGroup(groupId : number, userName : string){
    return this.connection.invoke("AddToGroup", groupId, userName)
  }

  public async leaveTheGroup(groupId : number){
    return this.connection.invoke("LeaveTheGroup", groupId)
  }

  public async removeUser(userToDeleteName : string, groupId : number){
    return this.connection.invoke("RemoveUser", userToDeleteName, groupId)
  }

  public async deleteGroup(groupId : number){
    return this.connection.invoke("DeleteGroup", groupId)
  }
  //endregion

  //region Quiz
  public async createQuiz(groupId : number){
    return this.connection.invoke("CreateQuiz", groupId)
  }

  public async editQuiz(groupId : number, quizId : number){
    return this.connection.invoke("EditQuiz", groupId, quizId)
  }

  public async submitQuiz(groupId : number){
    return this.connection.invoke("SubmitQuiz", groupId)
  }

  public async deleteQuiz(groupId : number){
    return this.connection.invoke("DeleteQuiz", groupId)
  }

  //endregion
}
