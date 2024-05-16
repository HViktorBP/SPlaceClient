import {Component, OnInit} from '@angular/core';
import {GroupNameComponent} from "./group-name/group-name.component";
import {GroupMainComponent} from "./group-main/group-main.component";
import {ParticipantsComponent} from "./group-main/participants/participants.component";
import {GroupOptionsComponent} from "./group-main/group-options/group-options.component";
import {QuizComponent} from "./group-main/quiz/quiz.component";
import {GroupsService} from "../../services/groups.service";
import {ActivatedRoute} from "@angular/router";
import {UserService} from "../../services/user.service";
import {BehaviorSubject, forkJoin, map, Observable, Subject, switchMap, takeUntil} from "rxjs";
import {User} from "../../interfaces/user";
import {GroupHubService} from "../../services/group-hub.service";
import {UsersDataService} from "../../services/users-data.service";
import {QuizzesService} from "../../services/quizzes.service";

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [
    GroupNameComponent,
    GroupMainComponent,
    ParticipantsComponent,
    GroupOptionsComponent,
    QuizComponent
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css'
})

export class GroupComponent implements OnInit{
  private id$ = new BehaviorSubject<string>('')
  private name$ = new BehaviorSubject<string>('')
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private auth : UserService,
              private group : GroupsService,
              private groupHub : GroupHubService,
              private route : ActivatedRoute,
              private usersDataService: UsersDataService,
              private quizzes : QuizzesService) {
  }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.updateData()
      this.getMessages()
    })

  }

  getName() {
    return this.name$
  }

  getMessages() {
    this.groupHub.getMessages(+this.id$.value)
  }

  updateData() {
    this.id$.next(this.route.snapshot.paramMap.get('id')!)

    this.usersDataService.updateGroupId(+this.id$.value)

    this.group.getUsersInGroup(+this.id$.value).pipe(
      switchMap(usersID => {
        const observables: Observable<User>[] = usersID.map(id => this.auth.getUserByID(id))
        return forkJoin(observables).pipe(
          map(usersData => usersData.map(user => user.username))
        )
      })
    ).subscribe(userUsernames => {
      this.usersDataService.updateUsersList(userUsernames);
      this.usersDataService.updateUserCount(userUsernames.length);

      this.group.getGroupById(+this.id$.value).pipe(
        switchMap(res => {
          this.name$.next(res[0]);
          return this.groupHub.joinChat(this.auth.getUsername(), this.id$.value);
        }),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        console.log(`${this.auth.getUsername()} is now active!`)
      }, error => {
        console.log("Error occurred while joining chat:", error)
      })
    })

    this.quizzes.getQuizzesInGroup(+this.id$.value).subscribe(quizzesList => {
      this.usersDataService.updateQuizzesList(quizzesList)
    })
  }
}
