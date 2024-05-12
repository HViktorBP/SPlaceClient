import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {QuizzesDTO} from "../interfaces/quizes-dto";

@Injectable({
  providedIn: 'root'
})

export class UsersDataService {
  private userNameSubject = new BehaviorSubject<string>('');
  userName$ = this.userNameSubject.asObservable();

  private userStatusSubject = new BehaviorSubject<string>('');
  userStatus$ = this.userStatusSubject.asObservable();

  private userCountSubject = new BehaviorSubject<number>(0);
  userCount$ = this.userCountSubject.asObservable();

  private groupNameSubject = new BehaviorSubject<string>('');
  groupName$ = this.groupNameSubject.asObservable();

  private userListSubject = new BehaviorSubject<string[]>([]);
  userList$ = this.userListSubject.asObservable();

  private quizListSubject = new BehaviorSubject<QuizzesDTO[]>([]);
  quizList$ = this.quizListSubject.asObservable();

  private groupMessagesSubject = new BehaviorSubject<any>([])
  groupMessages$ = this.groupMessagesSubject.asObservable()

  private groupIdSubject = new BehaviorSubject<number>(0)
  groupId$ = this.groupIdSubject.asObservable()

  constructor() { }

  updateUserCount(count: number) {
    this.userCountSubject.next(count)
  }

  updateUsersList(users: string[]) {
    this.userListSubject.next(users)
  }

  updateGroupName(groupName: string) {
    this.groupNameSubject.next(groupName)
  }

  updateQuizzesList(quizzesList: QuizzesDTO[]) {
    this.quizListSubject.next(quizzesList)
  }

  updateUsername(username: string) {
    this.userNameSubject.next(username)
  }

  updateStatus(status: string) {
    this.userStatusSubject.next(status)
  }

  updateGroupMessages(messages: any) {
    this.groupMessagesSubject.next(messages)
  }

  updateGroupId(groupId : number) {
    this.groupIdSubject.next(groupId)
  }
}
