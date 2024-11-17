import {Component} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {UserDataService} from "../../../../services/states/user-data.service";
import {RouterLink} from "@angular/router";
import {MatCard} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatLine} from "@angular/material/core";
import {MatList, MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";

/**
 * CreatedQuizzesComponent displays the quizzes created by user.
 */

@Component({
  selector: 'app-created-quizzes',
  standalone: true,
    imports: [
        AsyncPipe,
        FaIconComponent,
        NgForOf,
        RouterLink,
        MatCard,
        MatDivider,
        MatLine,
        MatList,
        MatListItem,
        MatIcon
    ],
  templateUrl: './created-quizzes.component.html',
  styleUrl: '../../../../custom/styles/info-list-box.scss'
})
export class CreatedQuizzesComponent {

  constructor(public userData : UserDataService) {

  }
}
