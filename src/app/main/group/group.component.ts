import {Component, OnInit} from '@angular/core';
import {GroupNameComponent} from "./group-name/group-name.component";
import {GroupMainComponent} from "./group-main/group-main.component";
import {ParticipantsComponent} from "./group-main/participants/participants.component";
import {GroupOptionsComponent} from "./group-main/group-options/group-options.component";
import {QuizComponent} from "./group-main/quiz/quiz.component";
import {ActivatedRoute} from "@angular/router";
import {BehaviorSubject} from "rxjs";
import {GroupHubService} from "../../services/group-hub.service";
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
  private name$ = new BehaviorSubject<string>('')

  constructor(private groupHub : GroupHubService,
              private route : ActivatedRoute,
              private usersDataService: UsersDataService) {
  }

  ngOnInit() {
    this.route.params.subscribe(() => {
      this.usersDataService.updateGroupDisplay(+this.route.snapshot.paramMap.get('id')!)
      this.groupHub.getMessages(+this.route.snapshot.paramMap.get('id')!)
    })
  }

  getName() {
    return this.name$
  }
}
