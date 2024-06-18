import {Component, OnDestroy, OnInit} from '@angular/core';
import {GroupNameComponent} from "./group-name/group-name.component";
import {GroupMainComponent} from "./group-main/group-main.component";
import {ParticipantsComponent} from "./group-main/participants/participants.component";
import {GroupOptionsComponent} from "./group-main/group-options/group-options.component";
import {QuizComponent} from "./group-main/quiz/quiz.component";
import {ActivatedRoute} from "@angular/router";
import {GroupHubService} from "../../services/group-hub.service";
import {UsersDataService} from "../../services/users-data.service";
import {Subscription} from "rxjs";

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
  styleUrl: './group.component.scss'
})

export class GroupComponent implements OnInit, OnDestroy{
  routeSubscription !: Subscription;
  constructor(private groupHub : GroupHubService,
              private route : ActivatedRoute,
              private usersDataService: UsersDataService) {
  }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(() => {
      this.usersDataService.updateGroupDisplay(+this.route.snapshot.paramMap.get('id')!)
      this.groupHub.getMessages(+this.route.snapshot.paramMap.get('id')!)
    })
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe()
    this.usersDataService.updateUserRole('')
    this.usersDataService.updateUserCurrentGroupId(0)
    console.log('Here')
  }
}
