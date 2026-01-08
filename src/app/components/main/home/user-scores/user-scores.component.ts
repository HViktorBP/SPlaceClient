import {Component} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {UserDataService} from "../../../../services/states/user-data.service";
import {MatCard} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatList, MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";

/**
 * UserScoresComponent displays the scores that user achieved on quizzes.
 */

@Component({
    selector: 'app-user-scores',
    imports: [
        AsyncPipe,
        NgForOf,
        MatCard,
        MatDivider,
        MatList,
        MatListItem,
        MatIcon
    ],
    templateUrl: './user-scores.component.html',
    styleUrl: '../../../../custom/styles/info-list-box.scss'
})

export class UserScoresComponent {

  constructor(public userData : UserDataService) { }
}
