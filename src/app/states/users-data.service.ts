import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {GroupIdentifier} from "../dtos/group/group-identifier";
import {QuizIdentifier} from "../dtos/quiz/quiz-identifier";
import {UserScore} from "../dtos/score/user-score";

@Injectable({
  providedIn: 'root'
})

export class UsersDataService {
  private userNameSubject = new BehaviorSubject<string>('');
  userName$ = this.userNameSubject.asObservable();

  private userStatusSubject = new BehaviorSubject<string>('');
  userStatus$ = this.userStatusSubject.asObservable();

  private userGroupDataSubject: BehaviorSubject<GroupIdentifier[]> = new BehaviorSubject<GroupIdentifier[]>([])
  userGroupData$ = this.userGroupDataSubject.asObservable()

  private userCreatedGroupDataSubject: BehaviorSubject<GroupIdentifier[]> = new BehaviorSubject<GroupIdentifier[]>([])
  userCreatedGroupData$ = this.userCreatedGroupDataSubject.asObservable()

  private userCreatedQuizzesDataSubject: BehaviorSubject<QuizIdentifier[]> = new BehaviorSubject<QuizIdentifier[]>([])
  userCreatedQuizzesData$ = this.userCreatedQuizzesDataSubject.asObservable()

  private userScoresDataSubject: BehaviorSubject<UserScore[]> = new BehaviorSubject<UserScore[]>([])
  userScoresData$ = this.userScoresDataSubject.asObservable()

  constructor() { }

  updateUsername(username: string) {
    this.userNameSubject.next(username)
  }

  get userNameAsync() {
    return this.userName$
  }

  updateStatus(status: string) {
    this.userStatusSubject.next(status)
  }

  get userStatusAsync() {
    return this.userStatus$
  }

  updateGroupData(groups : GroupIdentifier[]) {
    this.userGroupDataSubject.next(groups)
  }

  get userGroupsAsync() : Observable<GroupIdentifier[]> {
    return this.userGroupData$
  }
  updateCreatedGroupData(createdGroups : GroupIdentifier[]) {
    this.userCreatedGroupDataSubject.next(createdGroups)
  }

  get createdGroupsAsync() {
    return this.userCreatedGroupData$
  }

  get createdGroups() : GroupIdentifier[] {
    return this.userCreatedGroupDataSubject.value
  }

  updateCreatedQuizzesData(createdQuizzes : QuizIdentifier[]) {
    this.userCreatedQuizzesDataSubject.next(createdQuizzes)
  }

  get createdQuizzesAsync() {
    return this.userCreatedQuizzesData$
  }

  updateUserScores(scores : UserScore[]) {
    this.userScoresDataSubject.next(scores)
  }

  get userScoresAsync() {
    return this.userScoresData$
  }
}
