import {Component, OnDestroy, OnInit} from '@angular/core';
import {GroupHeaderComponent} from "./group-utilities/group-header/group-header.component";
import {GroupMainComponent} from "./group-main/group-main.component";
import {ParticipantsComponent} from "./group-utilities/group-tabs/participants/participants.component";
import {GroupOptionsComponent} from "./group-utilities/group-options/group-options.component";
import {QuizListComponent} from "./group-utilities/quiz-list/quiz-list.component";
import {ActivatedRoute, RouterOutlet} from "@angular/router";
import {Subscription, take} from "rxjs";
import {GroupsService} from "../../../services/groups.service";
import {GroupDataService} from "../../../services/states/group-data.service";
import {UsersService} from "../../../services/users.service";
import {GroupUtilitiesComponent} from "./group-utilities/group-utilities.component";
import {MatGridList, MatGridTile} from "@angular/material/grid-list";

/**
 * GroupComponent fetches group's data based on id provided in router and then generates UI for interacting with group.
 */

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [
    GroupHeaderComponent,
    GroupMainComponent,
    ParticipantsComponent,
    GroupOptionsComponent,
    QuizListComponent,
    RouterOutlet,
    GroupUtilitiesComponent,
    MatGridList,
    MatGridTile
  ],
  templateUrl: './group.component.html',
  styleUrl: './group.component.scss'
})

export class GroupComponent implements OnInit, OnDestroy{
  routeSubscription !: Subscription;

  constructor(
    private route: ActivatedRoute,
    private groupsService: GroupsService,
    private usersService: UsersService,
    private groupDataService: GroupDataService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      const groupId = +params['groupId'];
      this.loadGroupData(groupId);
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private loadGroupData(groupId: number) {
    this.groupsService.getGroup(groupId)
      .pipe(
        take(1)
      )
      .subscribe(group => {
        this.groupDataService.updateUserCurrentGroupId(groupId);
        this.groupDataService.updateGroupName(group.name);
        this.groupDataService.updateUserCount(group.users.length);
        this.groupDataService.updateUsersList(group.users);
        this.groupDataService.updateQuizzesList(group.quizzes);
        this.groupDataService.updateGroupMessages(group.messages);
        this.groupDataService.updateGroupScores(group.scores);
      });

    this.groupsService.getRole(this.usersService.getUserId(), groupId)
      .pipe(
        take(1)
      )
      .subscribe(role => {
        this.groupDataService.updateUserRole(role);
      });
  }
}
