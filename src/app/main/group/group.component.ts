import {Component, inject, OnInit} from '@angular/core';
import {GroupNameComponent} from "./group-name/group-name.component";
import {GroupMainComponent} from "./group-main/group-main.component";
import {ParticipantsComponent} from "./group-main/participants/participants.component";
import {GroupOptionsComponent} from "./group-main/group-options/group-options.component";
import {QuizComponent} from "./group-main/quiz/quiz.component";
import {GroupsService} from "../../services/groups.service";
import {ActivatedRoute} from "@angular/router";
import {AuthorisationService} from "../../services/authorisation.service";
import {forkJoin, map, switchMap} from "rxjs";

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
  private id: number = 0
  private name:string = ''
  private users:string[]= []

  constructor(private group : GroupsService, private auth : AuthorisationService) {

  }

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!
    this.name = this.route.snapshot.paramMap.get('name')!
    this.group.getUsersInGroup(this.id).pipe(
      switchMap(usersID => {
        const observables = usersID.map(id => this.auth.getUserByID(id));
        return forkJoin(observables);
      }),
      map(usersData => usersData.map(user => user.username))
    ).subscribe(userUsernames => {
      this.users.push(...userUsernames);
    });
  }

  getId() {
    return this.id
  }

  getUsers() {
    return this.users
  }

  getName() {
    return this.name
  }
}
