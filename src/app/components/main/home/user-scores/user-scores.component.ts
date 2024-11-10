import {Component} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {UsersDataService} from "../../../../services/states/users-data.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {MatCard} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatLine} from "@angular/material/core";
import {MatList, MatListItem} from "@angular/material/list";
import {faStar} from "@fortawesome/free-solid-svg-icons/faStar";

/**
 * UserScoresComponent displays the scores that user achieved on quizzes.
 */

@Component({
  selector: 'app-user-scores',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    FaIconComponent,
    MatCard,
    MatDivider,
    MatLine,
    MatList,
    MatListItem,
    NgIf
  ],
  templateUrl: './user-scores.component.html',
  styleUrl: '../../../../custom/styles/info-list-box.scss'
})

export class UserScoresComponent {
  icon = faStar

  constructor(public userData : UsersDataService) { }
}
