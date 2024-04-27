import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {QuizzesDTO} from "../interfaces/quizes-dto";

@Injectable({
  providedIn: 'root'
})

export class UsersDataService {
  private userCountSubject = new BehaviorSubject<number>(0);
  userCount$ = this.userCountSubject.asObservable();

  private groupNameSubject = new BehaviorSubject<string>('');
  groupName$ = this.groupNameSubject.asObservable();

  private userListSubject = new BehaviorSubject<string[]>([]);
  userList$ = this.userListSubject.asObservable();

  private quizListSubject = new BehaviorSubject<QuizzesDTO[]>([]);
  quizList$ = this.quizListSubject.asObservable();

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

  updateQuizesList(quizesList: QuizzesDTO[]) {
    this.quizListSubject.next(quizesList)
  }
}
