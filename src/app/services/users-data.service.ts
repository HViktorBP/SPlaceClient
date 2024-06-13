import { Injectable } from '@angular/core';
import {BehaviorSubject, forkJoin, map, Observable, switchMap} from "rxjs";
import {QuizzesDTO} from "../interfaces/quizzes-dto";
import {UserService} from "./user.service";
import {GroupsService} from "./groups.service";
import {User} from "../interfaces/user";
import {QuizzesService} from "./quizzes.service";

@Injectable({
  providedIn: 'root'
})

export class UsersDataService {
  private userCurrentGroupIdSubject = new BehaviorSubject<number>(0);
  userCurrentGroupId$ = this.userCurrentGroupIdSubject.asObservable();

  private userNameSubject = new BehaviorSubject<string>('');
  userName$ = this.userNameSubject.asObservable();

  private userStatusSubject = new BehaviorSubject<string>('');
  userStatus$ = this.userStatusSubject.asObservable();

  private userCountSubject = new BehaviorSubject<number>(0);
  userCount$ = this.userCountSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<string>('');
  userRole$ = this.userRoleSubject.asObservable();

  private groupNameSubject = new BehaviorSubject<string>('');
  groupName$ = this.groupNameSubject.asObservable();

  private userListSubject = new BehaviorSubject<string[]>([]);
  userList$ = this.userListSubject.asObservable();

  private quizListSubject = new BehaviorSubject<QuizzesDTO[]>([]);
  quizList$ = this.quizListSubject.asObservable();

  private groupMessagesSubject = new BehaviorSubject<any>([])
  groupMessages$ = this.groupMessagesSubject.asObservable()

  private userGroupDataSubject: BehaviorSubject<{ name: string; id: number }[]> = new BehaviorSubject<{name: string; id: number}[]>([])
  userGroupData$ = this.userGroupDataSubject.asObservable()
  constructor(private auth : UserService,
              private group : GroupsService,
              private quizzes : QuizzesService) { }

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
  updateGroupData(groups : {name: string; id: number}[]) {
    this.userGroupDataSubject.next(groups)
  }

  updateUserRole(role : string) {
    this.userRoleSubject.next(role)
  }

  updateUserCurrentGroupId(id : number){
    this.userCurrentGroupIdSubject.next(id);
  }

  get getUserCurrentGroupId() {
    return this.userCurrentGroupIdSubject.value;
  }

  updateGroupsList(username : string) {
    this.updateGroupData([])
    this.auth.getUserID(username).pipe(
      switchMap(userID => this.group.getGroups(userID)),
      switchMap(groups => {
        const observables: Observable<{ name: string; id: number }>[] = groups.map(groupID => {
          return this.group.getGroupById(groupID).pipe(
            map(groupName => ({ id: groupID, name: groupName }))
          );
        });
        return forkJoin(observables);
      })
    ).subscribe(groupInfos => {
      this.updateGroupData(groupInfos)
    })
  }

  updateGroupDisplay(groupId : number) {
    this.updateUserCurrentGroupId(groupId)

    this.group.getUsersInGroup(groupId).pipe(
      switchMap(usersID => {
        const observables: Observable<User>[] = usersID.map(id => this.auth.getUserByID(id))
        return forkJoin(observables).pipe(
          map(usersData => usersData.map(user => user.username))
        )
      })
    ).subscribe(userUsernames => {
      this.updateUsersList(userUsernames);
      this.updateUserCount(userUsernames.length);
    })

    this.group.getGroupById(groupId).subscribe(res => {
      this.updateGroupName(res);

      this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
        this.group.getUserRole(userID, groupId).subscribe(role => {
          this.updateUserRole(role)
          console.log(`${this.auth.getUsername()} is now active!`)
        })
      })
    }, error => {
      console.log("Error occurred while joining chat:", error)
    })

    this.quizzes.getQuizzesInGroup(groupId).subscribe(quizzesList => {
      this.updateQuizzesList(quizzesList)
    })
  }
}
