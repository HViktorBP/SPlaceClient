import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UsersDataService {
  private userCountSubject = new BehaviorSubject<number>(0);
  userCount$ = this.userCountSubject.asObservable();

  private userListSubject = new BehaviorSubject<string[]>([]);
  userList$ = this.userListSubject.asObservable();

  constructor() { }

  updateUserCount(count: number) {
    this.userCountSubject.next(count);
  }

  updateUsersList(users: string[]) {
    this.userListSubject.next(users);
  }
}
