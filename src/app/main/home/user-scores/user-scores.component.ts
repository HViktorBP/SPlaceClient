import {Component} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {UsersDataService} from "../../../states/users-data.service";

@Component({
  selector: 'app-user-scores',
  standalone: true,
    imports: [
        AsyncPipe,
        NgForOf
    ],
  templateUrl: './user-scores.component.html',
  styleUrl: './user-scores.component.scss'
})
export class UserScoresComponent {
  constructor(public userData : UsersDataService) {

  }
}
