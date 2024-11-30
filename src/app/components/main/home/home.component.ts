import {Component} from '@angular/core';
import {CreatedQuizzesComponent} from "./created-quizzes/created-quizzes.component";
import {CreatedGroupsComponent} from "./created-groups/created-groups.component";
import {UserScoresComponent} from "./user-scores/user-scores.component";
import {MatGridList, MatGridTile, MatGridTileHeaderCssMatStyler} from "@angular/material/grid-list";

/**
 * HomeComponent serves as the home page of application
 */

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CreatedQuizzesComponent,
    CreatedGroupsComponent,
    UserScoresComponent,
    MatGridList,
    MatGridTile,
    MatGridTileHeaderCssMatStyler
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {

}
