import {Component, inject, OnInit} from '@angular/core';
import {GroupNameComponent} from "./group-name/group-name.component";
import {GroupMainComponent} from "./group-main/group-main.component";
import {ParticipantsComponent} from "./group-main/participants/participants.component";
import {GroupOptionsComponent} from "./group-main/group-options/group-options.component";
import {QuizComponent} from "./group-main/quiz/quiz.component";
import {GroupsService} from "../../services/groups.service";
import {ActivatedRoute} from "@angular/router";
import {AuthorisationService} from "../../services/authorisation.service";
import {BehaviorSubject, forkJoin, map, Observable, Subject, switchMap, takeUntil} from "rxjs";
import {User} from "../../interfaces/user";
import {ChatService} from "../../services/chat.service";
import {waitForAsync} from "@angular/core/testing";

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
  private route = inject(ActivatedRoute)
  private id$ = new BehaviorSubject<string>('')
  private name$ = new BehaviorSubject<string>('')
  private users$ = new BehaviorSubject<string[]>([])
  private users:string[]= []
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private group : GroupsService,
              private auth : AuthorisationService,
              private chat: ChatService) {

  }

  ngOnInit() {
      this.route.params.subscribe(() => {
        this.updateData()
      });
  }

  getId() {
    return this.id$
  }

  getUsers() {
    return this.users$
  }

  getName() {
    return this.name$
  }

  updateData() {
    this.id$.next(this.route.snapshot.paramMap.get('id')!);

    this.group.getUsersInGroup(+this.id$.value).pipe(
      switchMap(usersID => {
        const observables: Observable<User>[] = usersID.map(id => this.auth.getUserByID(id));
        return forkJoin(observables).pipe(
          map(usersData => usersData.map(user => user.username))
        );
      })
    ).subscribe(userUsernames => {
      this.users.length = 0;
      this.users.push(...userUsernames);
      this.users$.next(this.users);

      this.group.getGroupById(+this.id$.value).pipe(
        switchMap(res => {
          this.name$.next(res[0]);
          return this.chat.joinChat(this.auth.getUsername(), this.id$.value);
        }),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        console.log(`${this.auth.getUsername()} is connected to the chat!`);
      }, error => {
        console.log("Error occurred while joining chat:", error);
      });
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
