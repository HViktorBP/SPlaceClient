import {Component} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";
import {UsersDataService} from "../../../../services/states/users-data.service";
import {RouterLink} from "@angular/router";
import {MatCard} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatLine} from "@angular/material/core";
import {MatList, MatListItem} from "@angular/material/list";

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
        MatListItem
    ],
  templateUrl: './created-quizzes.component.html',
  styleUrl: '../../../../custom/styles/info-list-box.scss'
})
export class CreatedQuizzesComponent {
  icon = faUsers

  constructor(public userData : UsersDataService) {

  }
}
