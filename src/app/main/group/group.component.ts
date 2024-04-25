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
import * as signalR from "@microsoft/signalr";
import {UsersDataService} from "../../services/users-data.service";

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

  public connection : signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7149/chat")
    .configureLogging(signalR.LogLevel.Information)
    .build()
  public messages$ = new BehaviorSubject<any>([])
  public messages: any[] = []
  public auth = inject(AuthorisationService)

  constructor(private group : GroupsService,
              private chat: ChatService,
              private route: ActivatedRoute,
              private usersDataService: UsersDataService) {
    this.start()
    this.connection.on("ReceiveMessage", (username: string, groupID:string, message: string, timespan: Date) => {
      this.messages = [...this.messages, {username, groupID, message, timespan}]
      this.messages$.next(this.messages)
    })
  }

  ngOnInit() {

    this.route.params.subscribe(() => {
      this.updateData()
      this.getMessages()
    })
  }

  public async start() {
      try {
        await this.connection.start()
        console.log("Connection is established")

      } catch (e) {
        console.log(e)
        setTimeout(() => {
          this.start()
        }, 6000)
      }
  }

  public async joinChat(username: string, group: string) {
    return this.connection.invoke("JoinChat", {username, group})
  }

  public async sendMessage(message: string, group: string, date: Date){
    return this.connection.invoke("SendMessage", message, group, date)
  }

  public async leaveChat() {
    return this.connection.stop()
  }

  getName() {
    return this.name$
  }

  getMessages() {
    this.messages$.value.length = 0
    this.messages.length = 0
    this.chat.getMessages(+this.id$.value).subscribe(result => {
      const observables = result.map(m => this.auth.getUserByID(m.userID))
      forkJoin(observables).subscribe(users => {
        result.forEach((m, index) => {
          const username = users[index].username
          this.messages = [...this.messages, { username, groupID: +m.groupID, message: m.message, timespan: m.timespan }]
        })
        this.messages$.next(this.messages);
      })
    })
  }

  updateData() {
    this.id$.next(this.route.snapshot.paramMap.get('id')!);
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
          return this.joinChat(this.auth.getUsername(), this.id$.value);
        }),
        takeUntil(this.destroy$)
      ).subscribe(() => {
        console.log(`${this.auth.getUsername()} is connected to the chat!`)
      }, error => {
        console.log("Error occurred while joining chat:", error)
      })
    })
  }
}
