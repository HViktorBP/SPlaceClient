import {Injectable} from '@angular/core';
import * as signalR from "@microsoft/signalr";
import {GroupDataService} from "./states/group-data.service";
import {MessageDto} from "../data-transferring/dtos/message/message-dto";
import {UsersDataService} from "./states/users-data.service";
import {UsersService} from "./users.service";
import {GroupsService} from "./groups.service";
import {catchError, take, tap, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {NgToastService} from "ng-angular-popup";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

/**
 * ApplicationHubService establishes connection with SignalR service on the server side and provides functionality to work with it.
 */

@Injectable({
  providedIn: 'root'
})

export class ApplicationHubService {
  private connection : signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl(environment.signalRConnectUrl)
    .configureLogging(signalR.LogLevel.Information)
    .withAutomaticReconnect()
    .build()

  /**
   * messages trucks the current messages that should be displayed to user.
   * @private
   */
  private messages: MessageDto[] = []

  /**
   * In constructor there are specifications for what he should do in cases of possible messages that can come from the SignalR service on the server side.
   */
  constructor(private groupDataService : GroupDataService,
              private usersDataService : UsersDataService,
              private usersService : UsersService,
              private groupService : GroupsService,
              private toast : NgToastService,
              private router : Router) {

    //#region Message
    /**
     * Updates the list of messages.
     */
    this.connection.on("MessageSent", (messageDto : MessageDto) => {
      const groupId = this.groupDataService.currentGroupId

      if (groupId == messageDto.groupId) {
        this.messages = [...this.groupDataService.groupMessages, messageDto]
        this.groupDataService.updateGroupMessages(this.messages)
      }
    })

    /**
     * Updates the message that was edited.
     */
    this.connection.on("MessageEdited", (messageDto : MessageDto) => {
      const groupId = this.groupDataService.currentGroupId

      if (groupId == messageDto.groupId) {
        this.messages = [...this.groupDataService.groupMessages]
        this.groupDataService.updateMessage(messageDto)
      }
    })

    /**
     * Deletes the message.
     */
    this.connection.on("MessageDeleted", (groupId : number, messageId : number) => {
      if (this.groupDataService.currentGroupId === groupId) {
        this.groupDataService.deleteMessage(messageId)
      }
    })
    //#endregion

    //#region Group
    /**
     * Updates the list of groups and informs user about him being added to the new group.
     */
    this.connection.on("AddedToGroup", (groupId : number) => {
      this.usersService.getUserAccount(this.usersService.getUserId())
        .pipe(
          take(1),
          tap(user => {
            this.usersDataService.updateGroupData(user.groups)
          }),
          map (user => user.groups),
          catchError(err => {
            return throwError(() => err)
          })
          )
        .subscribe({
          next : (groups) => {
            const groupName = groups.find(g => g.id == groupId)?.name
            this.toast.success({detail:"Info", summary: `You have been added to the ${groupName}!`, duration:3000})
          }
        })
    })

    /**
     * Updates the list and amount of participants in group and informs user about that.
     */
    this.connection.on("UpdateParticipants", (groupId : number) => {
      if (this.groupDataService.currentGroupId == groupId) {
        this.groupService.getGroup(groupId)
          .pipe(
            take(1),
            tap(group => {
              this.groupDataService.updateUsersList(group.users)
              this.groupDataService.updateUserCount(group.users.length)
            }),
            catchError(err => {
              return throwError(() => err)
            })
          )
          .subscribe({
            next : () => {
              this.toast.info({detail:"Info", summary: 'List of participants was updated.', duration:3000})
            }
          })
      }
    })

    /**
     * Informs about user who left the group.
     */
    this.connection.on("LeftTheGroup", (user : string, groupId : number) => {
      if (this.groupDataService.currentGroupId == groupId)
        this.toast.info({detail:"Info", summary: `${user} left the group!`, duration:3000})
    })

    /**
     * Updates the messages in group.
     */
    this.connection.on("UpdateMessages", (groupId : number) => {
      if (this.groupDataService.currentGroupId == groupId) {
        this.groupService.getGroup(groupId)
          .pipe(
            take(1),
            tap(group => {
              this.groupDataService.updateGroupMessages(group.messages)
            }),
            catchError(err => {
              return throwError(() => err)
            })
          )
          .subscribe({
            error : err => {
              this.toast.error({detail:"Error", summary: err, duration:3000})
            }
          })
      }
    })

    /**
     * Informs user about being removed from the group and notifies others about deleted quizzes in the group.
     * Also updates the list of the group and created quizzes.
     */
    this.connection.on("RemovedFromTheGroup", (groupId : number) => {
      this.usersDataService.createdQuizzes.forEach(quiz => {
        if (quiz.groupId == groupId) {
          this.deleteQuiz(groupId, quiz.id)
        }
      })

      this.usersService.getUserAccount(this.usersService.getUserId())
        .pipe(
          take(1),
          tap(user => {
            this.usersDataService.updateGroupData(user.groups)
            this.usersDataService.updateUserScores(user.scores)
            this.usersDataService.updateCreatedQuizzesData(user.createdQuizzes)
          }),
          catchError(err => {
            return throwError(() => err)
          })
        )
        .subscribe({
          next : () => {
            if (this.groupDataService.currentGroupId == groupId) {
              this.toast.info({detail:"Info", summary: `You have been removed from this group!`, duration:3000})
              this.router.navigate(['main'])
            }
          }
        })
    })

    /**
     * Informs user about group being deleted and updates the list of created quizzes, groups and scores.
     * If user was in the group that has been currently deleted than navigates him to the main page.
     */
    this.connection.on("GroupDeleted", (groupId : number) => {
      this.usersService.getUserAccount(this.usersService.getUserId())
        .pipe(
          take(1),
          tap(user => {
            this.usersDataService.updateCreatedQuizzesData(user.createdQuizzes)
            this.usersDataService.updateGroupData(user.groups)
            this.usersDataService.updateUserScores(user.scores)
          }),
          catchError(err => {
            return throwError(() => err)
          })
        )
        .subscribe({
          next : () => {
            if (this.groupDataService.currentGroupId == groupId) {
              this.toast.info({detail:"Info", summary: `Group has been deleted!`, duration:3000})
              this.router.navigate(['main'])
            }
          }
        })
    })

    /**
     * Updates user's role in group.
     */
    this.connection.on("RoleChanged", (groupId : number, role : string) => {
      if (this.groupDataService.currentGroupId == groupId) {
        this.groupService.getRole(this.usersService.getUserId(), groupId)
          .pipe(
            take(1),
            tap(role => {
              this.groupDataService.updateUserRole(role)
            }),
            catchError(err => {
              return throwError(() => err)
            })
          ).subscribe({
            next : () => {
              this.toast.info({detail:"Info", summary: `You are now promoted to ${role}`, duration:3000})
            }
        })
      }
    })

    /**
     * Updates the list of the groups and the group's name if the user is currently in it.
     */
    this.connection.on("GroupRenamed", (groupId : number) => {
      this.usersService.getUserAccount(this.usersService.getUserId())
        .pipe(
          take(1),
          tap(user => {
            this.usersDataService.updateGroupData(user.groups)
          }),
          catchError(err => {
            return throwError(() => err)
          })
        )
        .subscribe({
          next : () => {
            this.toast.info({detail:"Info", summary: "Group's list has been updated.", duration:3000})
          }
        })

      if (this.groupDataService.currentGroupId == groupId) {
        this.groupService.getGroup(groupId)
          .pipe(
            take(1),
            tap(group => {
              this.groupDataService.updateGroupName(group.name)
            }),
            map(group => group.name),
            catchError(err => {
              return throwError(() => err)
            })
          ).subscribe({
            next : (name) => {
              this.toast.info({detail:"Info", summary: `This group name changed to ${name}`, duration:3000})
            }
          })
      }
    })
    //#endregion

    //#region Quiz
    /**
     * Updates the list of quizzes.
     */
    this.connection.on("UpdateQuizList", (groupId : number) => {
      if (this.groupDataService.currentGroupId == groupId) {
        this.groupService.getGroup(groupId)
          .pipe(
            take(1),
            tap(group => {
              this.groupDataService.updateQuizzesList(group.quizzes)
            }),
            catchError(err => {
              return throwError(() => err)
            })
          )
          .subscribe({
            next : () => {
              this.toast.info({detail:"Info", summary: "Quiz's list has been updated.", duration:3000})
            }
          })
      }
    })

    /**
     * Updates the list of scores.
     */
    this.connection.on("UpdateScores", (groupId : number) => {
      if (this.groupDataService.currentGroupId == groupId) {
        this.groupService.getGroup(groupId)
          .pipe(
            take(1),
            tap(group => {
              this.groupDataService.updateGroupScores(group.scores)
            }),
            catchError(err => {
              return throwError(() => err)
            })
          )
          .subscribe({
            next : () => {
              this.toast.info({detail:"Error", summary: 'Scores had been updated!', duration:3000})
            }
          })
      }
    })

    /**
     * Updates the scores of user, and if user was in the group then updates the list of quizzes and group's scores
     */
    this.connection.on("QuizModified", (groupId : number, quizId : number) => {
      const parameters = this.router.url.split('/')
      let quizIdCurrent = 0

      if(parameters.includes('quiz'))
        quizIdCurrent = +parameters.at(parameters.length - 1)!

      this.usersService.getUserAccount(this.usersService.getUserId())
        .pipe(
          take(1),
          tap(user => {
            this.usersDataService.updateUserScores(user.scores)
          }),
          catchError(err => {
            return throwError(() => err)
          })
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
              this.groupDataService.updateQuizzesList(group.quizzes)
              this.groupDataService.updateGroupScores(group.scores)
            }),
            catchError(err => {
              return throwError(() => err)
            })
          )
          .subscribe({
            error : err => {
              this.toast.error({detail:"Error", summary: err, duration:3000})
            }
          })

        if (quizIdCurrent == quizId) {
          this.router
            .navigate(['/main/group/' + groupId])
            .then(() => {
              this.toast.info({detail:"Info", summary: "This quiz has been edited.", duration:3000})
            })
        }
      }

    })
    //#endregion
  }

  /**
   * start method establishes connection with the server side SignalR service.
   */
  public async start() {
    await this.connection.start()
  }

  /**
   * leave method terminates connection with the server side SignalR service.
   */
  public async leave() {
    return this.connection.stop()
  }

  /**
   * setGroupConnection method invokes SetGroupConnection on the server side.
   * @param groupId - group's id.
   */
  public async setGroupConnection(groupId : number){
    return this.connection.invoke("SetGroupConnection", groupId)
  }

  /**
   * addUserConnection method invokes AddUserConnection method on the server side.
   * @param username - user's username.
   */
  public async addUserConnection(username : string) {
    return this.connection.invoke("AddUserConnection", username)
  }

  //region Messages
  /**
   * sendMessage method invokes SendMessage method on the server side.
   * @param message - message to send.
   */
  public async sendMessage(message : MessageDto){
    return this.connection.invoke("SendMessage", message)
  }

  /**
   * editMessage method invokes EditMessage method on the server side.
   * @param message - message to edit.
   */
  public async editMessage(message : MessageDto){
    return this.connection.invoke("EditMessage", message)
  }

  /**
   * deleteMessage method invokes DeleteMessage method on the server side.
   * @param groupId - group's id.
   * @param messageId - message's id.
   */
  public async deleteMessage(groupId : number, messageId : number){
    return this.connection.invoke("DeleteMessage", groupId, messageId)
  }
  //endregion

  //region User
  /**
   * changeName method invokes ChangeUsername method on the server side.
   * @param newUsername - user's new username
   */
  public async changeName(newUsername : string){
    return this.connection.invoke("ChangeUsername", newUsername)
  }

  /**
   * changeStatus method invokes ChangeStatus method on the server side.
   */
  public async changeStatus(){
    return this.connection.invoke("ChangeStatus")
  }

  /**
   * deleteUser method invokes DeleteUser method on the server side.
   * @param groupsToDelete - group's to delete with user.
   */
  public async deleteUser(groupsToDelete : number[]){
    return this.connection.invoke("DeleteUser", groupsToDelete)
  }
  //endregion

  //region Group
  /**
   * changeRole method invokes ChangeRole method on the server side.
   @param username - user's username.
   @param role - user's role.
   @param groupId - group's id.
   */
  public async changeRole(username : string, role : number, groupId : number){
    return this.connection.invoke("ChangeRole", username, role, groupId)
  }

  /**
   * renameGroup method invokes RenameGroup method on the server side.
   * @param groupId - group's id.
   */
  public async renameGroup(groupId : number){
    return this.connection.invoke("RenameGroup", groupId)
  }

  /**
   * addToGroup method invokes AddToGroup method on the server side.
   * @param groupId - group's id.
   * @param username - user's username.
   */
  public async addToGroup(groupId : number, username : string){
    return this.connection.invoke("AddToGroup", groupId, username)
  }

  /**
   * leaveGroup method invokes LeaveTheGroup method on the server side.
   * @param groupId - group's id.
   */
  public async leaveGroup(groupId : number){
    return this.connection.invoke("LeaveTheGroup", groupId)
  }

  /**
   * removeUser method invokes RemoveUser method on the server side.
   * @param userToDeleteName - name of the user to delete.
   * @param groupId - group's id.
   */
  public async removeUser(userToDeleteName : string, groupId : number){
    return this.connection.invoke("RemoveUser", userToDeleteName, groupId)
  }

  /**
   * deleteGroup method invokes DeleteGroup method on the server side.
   * @param groupId - group's id.
   */
  public async deleteGroup(groupId : number){
    return this.connection.invoke("DeleteGroup", groupId)
  }
  //endregion

  //region Quiz
  /**
   * createQuiz method invokes CreateQuiz method on the server side.
   * @param groupId - group's id.
   */
  public async createQuiz(groupId : number){
    return this.connection.invoke("CreateQuiz", groupId)
  }

  /**
   * editQuiz method invokes EditQuiz method on the server side.
   * @param groupId - group's id.
   * @param quizId - quiz's id.
   */
  public async editQuiz(groupId : number, quizId : number){
    return this.connection.invoke("EditQuiz", groupId, quizId)
  }

  /**
   * submitQuiz method invokes SubmitQuiz method on the server side.
   * @param groupId - group's id.
   */
  public async submitQuiz(groupId : number){
    return this.connection.invoke("SubmitQuiz", groupId)
  }

  /**
   * deleteQuiz method invokes DeleteQuiz method on the server side.
   @param groupId - group's id.
   @param quizId - quiz's id.
   */
  public async deleteQuiz(groupId : number, quizId : number){
    return this.connection.invoke("DeleteQuiz", groupId, quizId)
  }
  //endregion
}
