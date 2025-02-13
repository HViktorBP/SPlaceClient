import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Role} from "../../data-transferring/enums/role";
import {QuizIdentifier} from "../../data-transferring/dtos/quiz/quiz-identifier";
import {MessageDto} from "../../data-transferring/dtos/message/message-dto";
import {QuizScores} from "../../data-transferring/dtos/score/quiz-scores";
import {UserPublicData} from "../../data-transferring/dtos/user/user-public-data";

@Injectable({
  providedIn: 'root'
})

/**
 * GroupDataService provides the data of the group where the user currently is.
 */
export class GroupDataService {
  /**
   * currentGroupIdSubject contains the id of the group where user currently is.
   * @private
   */
  private currentGroupIdSubject = new BehaviorSubject<number>(0)

  /**
   * userCountSubject contains the amount of user that participates in the group where the user currently is.
   * @private
   */
  private userCountSubject = new BehaviorSubject<number>(0)
  /**
   * userCount$ provides userCountSubject as observable.
   * @private
   */
  userCount$ = this.userCountSubject.asObservable()

  /**
   * userRoleSubject contains the role of the user where he currently is.
   * @private
   */
  private userRoleSubject = new BehaviorSubject<Role>(Role.Participant)
  /**
   * userRole$ provides userRoleSubject as observable.
   * @private
   */
  userRole$ = this.userRoleSubject.asObservable()

  /**
   * groupNameSubject contains the name of the group where user currently is.
   * @private
   */
  private groupNameSubject = new BehaviorSubject<string>('')
  /**
   * groupName$ provides groupNameSubject as observable.
   */
  groupName$ = this.groupNameSubject.asObservable()

  /**
   * userListSubject contains the list of the participants in the group where user currently is.
   * @private
   */
  private userListSubject = new BehaviorSubject<UserPublicData[]>([])
  /**
   * userList$ provides userListSubject as observable.
   */
  userList$ = this.userListSubject.asObservable()

  /**
   * quizListSubject contains the list of the quizzes in the group where user currently is.
   * @private
   */
  private quizListSubject = new BehaviorSubject<QuizIdentifier[]>([])
  /**
   * quizList$ provides quizListSubject as observable.
   */
  quizList$ = this.quizListSubject.asObservable()

  /**
   * groupMessagesSubject contains the list of the messages in the group where user currently is.
   * @private
   */
  private groupMessagesSubject = new BehaviorSubject<MessageDto[]>([])
  /**
   * groupMessages$ provides groupMessagesSubject as observable.
   * @private
   */
  groupMessages$ = this.groupMessagesSubject.asObservable()

  /**
   * groupScoresSubject contains the list of the scores in the group where user currently is.
   * @private
   */
  private groupScoresSubject = new BehaviorSubject<QuizScores[]>([])
  /**
   * groupScores$ provides groupScoresSubject as observable.
   */
  groupScores$ = this.groupScoresSubject.asObservable()

  constructor() { }

  /**
   * updateUserCount updates the amount of users in group.
   * @param count - amount of users in group.
   */
  updateUserCount(count: number) {
    this.userCountSubject.next(count)
  }

  /**
   * userCountAsync provides the observable for the amount of participants in group.
   */
  get userCountAsync() : Observable<number> {
    return this.userCount$
  }

  /**
   * updateUsersList updates the participants' list in group.
   * @param users - public data of the user's in group.
   */
  updateUsersList(users: UserPublicData[]) : void {
    this.userListSubject.next(users)
  }

  /**
   * userListAsync provides the observable for the participants' list in group.
   */
  get userListAsync(): Observable<UserPublicData[]> {
    return this.userList$
  }

  /**
   * updateGroupName updates the name of the group.
   * @param groupName - name of the group
   */
  updateGroupName(groupName: string) : void {
    this.groupNameSubject.next(groupName)
  }

  /**
   * groupNameAsync provides the observable for the group's name.
   */
  get groupNameAsync() : Observable<string> {
    return this.groupName$
  }

  /**
   * updateQuizzesList updates the list of the quizzes in the group.
   * @param quizzesList - list of the quizzes.
   */
  updateQuizzesList(quizzesList: QuizIdentifier[]) : void {
    this.quizListSubject.next(quizzesList)
  }

  /**
   * quizzesListAsync provides the observable for the list of quizzes.
   */
  get quizzesListAsync() : Observable<QuizIdentifier[]> {
    return this.quizList$
  }

  /**
   * updateMessage updates specific message in the group.
   * @param message - message to update.
   */
  updateMessage(message : MessageDto) : void {
    const index = this.groupMessagesSubject.value.findIndex(m => m.id === message.id)

    if (index !== -1) {
      this.groupMessagesSubject.value[index] = message
    }
  }

  /**
   * deleteMessage deletes specific message in the group.
   * @param messageId - id of the message to delete.
   */
  deleteMessage(messageId : number) : void {
    const index = this.groupMessagesSubject.value.findIndex(m => m.id === messageId)

    if (index !== -1) {
      this.groupMessagesSubject.value.splice(index, 1)
    }
  }

  /**
   * updateGroupMessages updates the list of the messages in the group.
   * @param messages
   */
  updateGroupMessages(messages: MessageDto[]) : void {
    this.groupMessagesSubject.next(messages)
  }

  /**
   * groupMessagesAsync provides the observable for the messages in the group.
   */
  get groupMessagesAsync(): Observable<MessageDto[]> {
    return this.groupMessages$
  }

  /**
   * groupMessages provides the current messages in the group.
   */
  get groupMessages() : MessageDto[] {
    return this.groupMessagesSubject.value
  }

  /**
   * updateGroupMessages updates the role of the user in the group.
   * @param role - user's role
   */
  updateUserRole(role : Role) {
    this.userRoleSubject.next(role)
  }

  /**
   * userRoleAsync provides the observable for the user's role in the group.
   */
  get userRoleAsync() : Observable<Role> {
    return this.userRole$
  }

  /**
   * updateUserCurrentGroupId updates the id of the group where user currently is.
   * @param groupId - group's id
   */
  updateUserCurrentGroupId(groupId : number) : void{
    this.currentGroupIdSubject.next(groupId)
  }

  /**
   * currentGroupId provides the current id of the group where user is.
   */
  get currentGroupId() : number {
    return this.currentGroupIdSubject.value
  }

  /**
   * updateGroupScores updates the scores of users on each quiz in group.
   * @param scores - users' scores on quizzes.
   */
  updateGroupScores(scores : QuizScores[]) : void {
    this.groupScoresSubject.next(scores)
  }

  /**
   * groupScoresAsync provides the observable for the scores of users on each quiz in group.
   */
  get groupScoresAsync() : Observable<QuizScores[]> {
    return this.groupScores$
  }
}
