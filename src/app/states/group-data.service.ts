import {Injectable} from '@angular/core';
import {BehaviorSubject, forkJoin, map, Observable, switchMap} from "rxjs";
import {Role} from "../enums/role";
import {QuizIdentifier} from "../dtos/quiz/quiz-identifier";
import {MessageDto} from "../dtos/message/message-dto";

@Injectable({
  providedIn: 'root'
})

export class GroupDataService {
  private userCountSubject = new BehaviorSubject<number>(0);
  userCount$ = this.userCountSubject.asObservable();

  private userRoleSubject = new BehaviorSubject<Role>(Role.Participant);
  userRole$ = this.userRoleSubject.asObservable();

  private groupNameSubject = new BehaviorSubject<string>('');
  groupName$ = this.groupNameSubject.asObservable();

  private userListSubject = new BehaviorSubject<string[]>([]);
  userList$ = this.userListSubject.asObservable();

  private quizListSubject = new BehaviorSubject<QuizIdentifier[]>([]);
  quizList$ = this.quizListSubject.asObservable();

  private groupMessagesSubject = new BehaviorSubject<MessageDto[]>([])
  groupMessages$ = this.groupMessagesSubject.asObservable()

  constructor() { }

  updateUserCount(count: number) {
    this.userCountSubject.next(count)
  }

  get userCount() {
    return this.userCount$
  }

  updateUsersList(users: string[]) {
    this.userListSubject.next(users)
  }

  get userList() {
    return this.userList$
  }

  updateGroupName(groupName: string) {
    this.groupNameSubject.next(groupName)
  }

  get groupName() {
    return this.groupName$
  }

  updateQuizzesList(quizzesList: QuizIdentifier[]) {
    this.quizListSubject.next(quizzesList)
  }

  get quizzesList() {
    return this.quizList$
  }

  updateGroupMessages(messages: MessageDto[]) {
    this.groupMessagesSubject.next(messages)
  }

  get groupMessages() {
    return this.groupMessages$
  }

  updateUserRole(role : Role) {
    this.userRoleSubject.next(role)
  }

  get userRole() {
    return this.userRole$
  }

  // updateGroupDisplay(groupId : number) {
  //   this.updateUserCurrentGroupId(groupId)
  //
  //   this.group.getUsersInGroup(groupId).pipe(
  //     switchMap(usersID => {
  //       const observables: Observable<User>[] = usersID.map(id => this.auth.getUserByID(id))
  //       return forkJoin(observables).pipe(
  //         map(usersData => usersData.map(user => user.username))
  //       )
  //     })
  //   ).subscribe(userUsernames => {
  //     this.updateUsersList(userUsernames);
  //     this.updateUserCount(userUsernames.length);
  //   })
  //
  //   this.group.getGroupById(groupId).subscribe(res => {
  //     this.updateGroupName(res);
  //
  //     this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
  //       this.group.getUserRole(userID, groupId).subscribe(role => {
  //         this.updateUserRole(role)
  //         console.log(`${this.auth.getUsername()} is now active!`)
  //       })
  //     })
  //   }, error => {
  //     console.log("Error occurred while joining chat:", error)
  //   })
  //
  //   this.quizzes.getQuizzesInGroup(groupId).subscribe(quizzesList => {
  //     this.updateQuizzesList(quizzesList)
  //   })
  // }
}
