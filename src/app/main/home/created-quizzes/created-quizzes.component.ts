import {Component} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";
import {UsersDataService} from "../../../states/users-data.service";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-created-quizzes',
  standalone: true,
  imports: [
    AsyncPipe,
    FaIconComponent,
    NgForOf,
    RouterLink
  ],
  templateUrl: './created-quizzes.component.html',
  styleUrl: './created-quizzes.component.scss'
})
export class CreatedQuizzesComponent {
  icon = faUsers

  constructor(public userData : UsersDataService) {

  }
}
