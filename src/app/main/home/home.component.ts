import {Component} from '@angular/core';
import {InfoComponent} from "./info/info.component";
import {QuizInfoComponent} from "./quiz-info/quiz-info.component";
import {GroupsInfoComponent} from "./groups-info/groups-info.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    InfoComponent,
    QuizInfoComponent,
    GroupsInfoComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
