import {Component, OnDestroy, OnInit} from '@angular/core';
import {GroupMainComponent} from "../group-main/group-main.component";
import {ParticipantsComponent} from "./group-tabs/participants/participants.component";
import {GroupOptionsComponent} from "./group-options/group-options.component";
import {QuizListComponent} from "./quiz-list/quiz-list.component";
import {GroupHeaderComponent} from "./group-header/group-header.component";
import {Subscription} from "rxjs";
import {GroupDataService} from "../../../../services/states/group-data.service";
import {Role} from "../../../../data-transferring/enums/role";
import {GroupTabsComponent} from "./group-tabs/group-tabs.component";

/**
 * GroupUtilitiesComponent provides main UI for group features.
 * It also determines role of the user in group and based on that provides user with functions his able to perform.
 */

@Component({
    selector: 'app-group-utilities',
    imports: [
        GroupMainComponent,
        ParticipantsComponent,
        GroupOptionsComponent,
        QuizListComponent,
        GroupHeaderComponent,
        GroupTabsComponent
    ],
    templateUrl: './group-utilities.component.html',
    styleUrl: './group-utilities.component.scss'
})

export class GroupUtilitiesComponent implements OnInit, OnDestroy {
  /**
   * Description: User's role in the group.
   */
  userRole!: Role

  /**
   * Description: Role subscription.
   * @private
   */
  private roleSubscription!: Subscription

  constructor(private groupDataService : GroupDataService) { }

  ngOnInit() {
    this.roleSubscription = this.groupDataService.userRoleAsync.subscribe(role => {
      this.setUserRole(role)
    })
  }


  ngOnDestroy() {
    if (this.roleSubscription)
      this.roleSubscription.unsubscribe()
  }

  /**
   * Description: sets the user role which will later be passed to other components
   * @param {Role} role - user's role
   * @private
   * @memberOf GroupUtilitiesComponent
   */
  private setUserRole(role: Role) {
    this.userRole = role
  }
}
