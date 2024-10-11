import { Injectable } from '@angular/core';
import {BehaviorSubject, forkJoin, map, Observable, switchMap} from "rxjs";
import {QuizzesDTO} from "../dtos/quizzes-dto";
import {UsersService} from "../services/users.service";
import {GroupsService} from "../services/groups.service";
import {User} from "../dtos/user";
import {QuizzesService} from "../services/quizzes.service";
import {GroupIdentifier} from "../dtos/group/group-identifier";
import {QuizIdentifier} from "../dtos/quiz/quiz-identifier";
import {UserScore} from "../dtos/score/user-score";

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

  private userGroupDataSubject: BehaviorSubject<GroupIdentifier[]> = new BehaviorSubject<GroupIdentifier[]>([])
  userGroupData$ = this.userGroupDataSubject.asObservable()

  private userCreatedGroupDataSubject: BehaviorSubject<GroupIdentifier[]> = new BehaviorSubject<GroupIdentifier[]>([])
  userCreatedGroupData$ = this.userCreatedGroupDataSubject.asObservable()

  private userCreatedQuizzesDataSubject: BehaviorSubject<QuizIdentifier[]> = new BehaviorSubject<QuizIdentifier[]>([])
  userCreatedQuizzesData$ = this.userCreatedQuizzesDataSubject.asObservable()

  private userScoresDataSubject: BehaviorSubject<UserScore[]> = new BehaviorSubject<UserScore[]>([])
  userScoresData$ = this.userScoresDataSubject.asObservable()

  constructor(private auth : UsersService,
              private group : GroupsService,
              private quizzes : QuizzesService) { }

  updateUsername(username: string) {
    this.userNameSubject.next(username)
  }

  updateStatus(status: string) {
    this.userStatusSubject.next(status)
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
