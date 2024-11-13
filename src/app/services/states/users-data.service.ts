import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {GroupIdentifier} from "../../data-transferring/dtos/group/group-identifier";
import {QuizIdentifier} from "../../data-transferring/dtos/quiz/quiz-identifier";
import {QuizScores} from "../../data-transferring/dtos/score/quiz-scores";

@Injectable({
  providedIn: 'root'
})

/**
 * UsersDataService provides the user's data.
 */
export class UsersDataService {
  /**
   * userNameSubject contains the name of the user.
   * @private
   */
  private userNameSubject = new BehaviorSubject<string>('')
  /**
   * userName$ provides userNameSubject as observable.
   * @private
   */
  userName$ = this.userNameSubject.asObservable()

  /**
   * userStatusSubject contains the status of the user.
   * @private
   */
  private userStatusSubject = new BehaviorSubject<string>('')
  /**
   * userStatus$ provides userStatusSubject as observable.
   */
  userStatus$ = this.userStatusSubject.asObservable()

  /**
   * userGroupDataSubject contains the list of the groups where user participates.
   * @private
   */
  private userGroupDataSubject: BehaviorSubject<GroupIdentifier[]> = new BehaviorSubject<GroupIdentifier[]>([])
  /**
   * userGroupData$ provides userGroupDataSubject as observable.
   */
  userGroupData$ = this.userGroupDataSubject.asObservable()

  /**
   * userCreatedGroupDataSubject contains the list of the groups that user has created.
   * @private
   */
  private userCreatedGroupDataSubject: BehaviorSubject<GroupIdentifier[]> = new BehaviorSubject<GroupIdentifier[]>([])
  /**
   * userCreatedGroupData$ provides userCreatedGroupDataSubject as observable.
   */
  userCreatedGroupData$ = this.userCreatedGroupDataSubject.asObservable()

  /**
   * userCreatedQuizzesDataSubject contains the list of the quizzes that user has created.
   * @private
   */
  private userCreatedQuizzesDataSubject: BehaviorSubject<QuizIdentifier[]> = new BehaviorSubject<QuizIdentifier[]>([])
  /**
   * userCreatedQuizzesData$ provides userCreatedQuizzesDataSubject as observable.
   */
  userCreatedQuizzesData$ = this.userCreatedQuizzesDataSubject.asObservable()

  /**
   * userScoresDataSubject contains the list of the user's scores.
   * @private
   */
  private userScoresDataSubject: BehaviorSubject<QuizScores[]> = new BehaviorSubject<QuizScores[]>([])
  /**
   * userScoresData$ provides userScoresDataSubject as observable.
   */
  userScoresData$ = this.userScoresDataSubject.asObservable()

  constructor() { }

  /**
   * updateUsername updates user's name.
   * @param username - user's name
   */
  updateUsername(username: string) : void {
    this.userNameSubject.next(username)
  }

  /**
   * userNameAsync provides the observable for the user's name.
   */
  get usernameAsync() : Observable<string> {
    return this.userName$
  }

  /**
   * updateStatus updates user's status.
   * @param status - user's status
   */
  updateStatus(status: string) : void {
    this.userStatusSubject.next(status)
  }

  /**
   * userStatusAsync provides the observable for the user's status.
   */
  get userStatusAsync(): Observable<string> {
    return this.userStatus$
  }

  /**
   * updateGroupData updates user's groups.
   * @param groups - groups' identifier.
   */
  updateGroupData(groups : GroupIdentifier[]) : void {
    this.userGroupDataSubject.next(groups)
  }

  /**
   * userGroupsAsync provides the observable for the user's groups.
   */
  get userGroupsAsync() : Observable<GroupIdentifier[]> {
    return this.userGroupData$
  }

  /**
   * updateCreatedGroupData updates the list of the group that user created.
   * @param createdGroups - groups that user created.
   */
  updateCreatedGroupData(createdGroups : GroupIdentifier[]) : void {
    this.userCreatedGroupDataSubject.next(createdGroups)
  }

  /**
   * createdGroupsAsync provides the observable for the user's created groups.
   */
  get createdGroupsAsync() : Observable<GroupIdentifier[]> {
    return this.userCreatedGroupData$
  }

  /**
   * createdGroups provides the current list of groups that user created.
   */
  get createdGroups() : GroupIdentifier[] {
    return this.userCreatedGroupDataSubject.value
  }

  /**
   * updateCreatedQuizzesData updates the list of the quizzes that user created.
   * @param createdQuizzes - list of quizzes created by user.
   */
  updateCreatedQuizzesData(createdQuizzes : QuizIdentifier[]) : void {
    this.userCreatedQuizzesDataSubject.next(createdQuizzes)
  }

  /**
   * createdQuizzesAsync provides the observable for the user's created quizzes.
   */
  get createdQuizzesAsync() : Observable<QuizIdentifier[]> {
    return this.userCreatedQuizzesData$
  }

  /**
   * createdQuizzes provides the current list of quizzes hat user created.
   */
  get createdQuizzes() : QuizIdentifier[] {
    return this.userCreatedQuizzesDataSubject.value
  }

  /**
   * updateUserScores updates the list of the user's scores.
   * @param scores - user's scores.
   */
  updateUserScores(scores : QuizScores[]) : void {
    this.userScoresDataSubject.next(scores)
  }

  /**
   * userScoresAsync provides the observable for the user's scores.
   */
  get userScoresAsync() : Observable<QuizScores[]> {
    return this.userScoresData$
  }
}
