import { Injectable } from '@angular/core';
import {BehaviorSubject, forkJoin, map, Observable, switchMap} from "rxjs";
import {QuizzesDTO} from "../interfaces/quizes-dto";
import {UserService} from "./user.service";
import {GroupsService} from "./groups.service";

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

  private userGroupDataSubject: BehaviorSubject<{ name: string; id: number }[]> = new BehaviorSubject<{name: string; id: number}[]>([])
  userGroupData$ = this.userGroupDataSubject.asObservable()
  constructor(private auth : UserService,
              private groups : GroupsService) { }

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

  updateGroupData(groups : {name: string; id: number}[]) {
    this.userGroupDataSubject.next(groups)
  }

  updateGroup(username : string) {
    this.updateGroupData([])
    this.auth.getUserID(username).pipe(
      switchMap(userID => this.groups.getGroups(userID)),
      switchMap(groups => {
        const observables: Observable<{ name: string; id: number }>[] = groups.map(groupID => {
          return this.groups.getGroupById(groupID).pipe(
            map(groupName => ({ id: groupID, name: groupName }))
          );
        });
        return forkJoin(observables);
      })
    ).subscribe(groupInfos => {
      this.updateGroupData(groupInfos)
    })
  }
}
