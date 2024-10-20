import {Component, OnDestroy, OnInit} from '@angular/core';
import {GroupMainComponent} from "../group-main/group-main.component";
import {ParticipantsComponent} from "./participants/participants.component";
import {GroupOptionsComponent} from "./group-options/group-options.component";
import {QuizListComponent} from "./quiz-list/quiz-list.component";
import {GroupNameComponent} from "./group-name/group-name.component";
import {Subscription} from "rxjs";
import {GroupDataService} from "../../../states/group-data.service";
import {Role} from "../../../enums/role";

@Component({
  selector: 'app-group-utilities',
  standalone: true,
  imports: [
    GroupMainComponent,
    ParticipantsComponent,
    GroupOptionsComponent,
    QuizListComponent,
    GroupNameComponent
  ],
  templateUrl: './group-utilities.component.html',
  styleUrl: './group-utilities.component.scss'
})

export class GroupUtilitiesComponent implements OnInit, OnDestroy {
  isCreator: boolean = false;
  isAdministrator: boolean = false;
  isModerator: boolean = false;
  isParticipant: boolean = false;
  roleSubscription!: Subscription;

  constructor(private groupDataService : GroupDataService) {

  }

  ngOnInit() {
    this.roleSubscription = this.groupDataService.userRoleAsync.subscribe(role => {
      this.setUserRole(role)
    })
  }


  ngOnDestroy() {
    this.roleSubscription.unsubscribe()
  }

  private setUserRole(role: Role) {
    switch (role) {
      case Role.Creator:
        this.isCreator = true;
        this.isAdministrator = false;
        this.isModerator = false;
        this.isParticipant = false;
        break
      case Role.Administrator:
        this.isCreator = false;
        this.isAdministrator = true;
        this.isModerator = false;
        this.isParticipant = false;
        break
      case Role.Moderator:
        this.isCreator = false;
        this.isAdministrator = false;
        this.isModerator = true;
        this.isParticipant = false;
        break
      default:
        this.isCreator = false;
        this.isAdministrator = false;
        this.isModerator = false;
        this.isParticipant = true;
    }
  }
}
