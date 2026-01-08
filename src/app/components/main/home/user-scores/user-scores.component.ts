import {Component} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {UserDataService} from "../../../../services/states/user-data.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {MatCard} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatLine} from "@angular/material/core";
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
        FaIconComponent,
        MatCard,
        MatDivider,
        MatLine,
        MatList,
        MatListItem,
        NgIf,
        MatIcon
    ],
    templateUrl: './user-scores.component.html',
    styleUrl: '../../../../custom/styles/info-list-box.scss'
})

export class UserScoresComponent {

  constructor(public userData : UserDataService) { }
}
