import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Role} from "../data-transferring/enums/role";
import {QuizIdentifier} from "../data-transferring/dtos/quiz/quiz-identifier";
import {MessageDto} from "../data-transferring/dtos/message/message-dto";
import {QuizScores} from "../data-transferring/dtos/score/quiz-scores";
import {UserPublicData} from "../data-transferring/dtos/user/user-public-data";

@Injectable({
  providedIn: 'root'
})

export class GroupDataService {
  private currentGroupIdSubject = new BehaviorSubject<number>(0);
  currentGroupId$ = this.currentGroupIdSubject.asObservable();

  private userCountSubject = new BehaviorSubject<number>(0);
  userCount$ = this.userCountSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<Role>(Role.Participant);
  userRole$ = this.userRoleSubject.asObservable();

  private groupNameSubject = new BehaviorSubject<string>('');
  groupName$ = this.groupNameSubject.asObservable();

  private userListSubject = new BehaviorSubject<UserPublicData[]>([]);
  userList$ = this.userListSubject.asObservable();

  private quizListSubject = new BehaviorSubject<QuizIdentifier[]>([]);
  quizList$ = this.quizListSubject.asObservable();

  private groupMessagesSubject = new BehaviorSubject<MessageDto[]>([])
  groupMessages$ = this.groupMessagesSubject.asObservable()

  private groupScoresSubject = new BehaviorSubject<QuizScores[]>([])
  groupScores$ = this.groupScoresSubject.asObservable()

  constructor() { }

  updateUserCount(count: number) {
    this.userCountSubject.next(count)
  }

  get userCountAsync() {
    return this.userCount$
  }

  updateUsersList(users: UserPublicData[]) {
    this.userListSubject.next(users)
  }

  get userListAsync() {
    return this.userList$
  }

  updateGroupName(groupName: string) {
    this.groupNameSubject.next(groupName)
  }

  get groupNameAsync() {
    return this.groupName$
  }

  updateQuizzesList(quizzesList: QuizIdentifier[]) {
    this.quizListSubject.next(quizzesList)
  }

  get quizzesListAsync() {
    return this.quizList$
  }

  updateMessage(message : MessageDto) {
    const index = this.groupMessagesSubject.value.findIndex(m => m.id === message.id)

    if (index !== -1) {
      this.groupMessagesSubject.value[index] = message
    }
  }

  deleteMessage(messageId : number) {
    const index = this.groupMessagesSubject.value.findIndex(m => m.id === messageId)

    if (index !== -1) {
      this.groupMessagesSubject.value.splice(index, 1)
    }
  }

  updateGroupMessages(messages: MessageDto[]) {
    this.groupMessagesSubject.next(messages)
  }

  get groupMessagesAsync() {
    return this.groupMessages$
  }

  get groupMessages() {
    return this.groupMessagesSubject.value
  }

  updateUserRole(role : Role) {
    this.userRoleSubject.next(role)
  }

  get userRoleAsync() {
    return this.userRole$
  }

  updateUserCurrentGroupId(id : number){
    this.currentGroupIdSubject.next(id);
  }

  get currentGroupId() {
    return this.currentGroupIdSubject.value
  }

  updateGroupScores(scores : QuizScores[]) {
    this.groupScoresSubject.next(scores);
  }

  get groupScoresAsync() {
    return this.groupScores$
  }
}
