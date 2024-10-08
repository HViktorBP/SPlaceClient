import {Component} from '@angular/core';
import {QuizInfoComponent} from "./quiz-info/quiz-info.component";
import {GroupsInfoComponent} from "./groups-info/groups-info.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    QuizInfoComponent,
    GroupsInfoComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
