import {Component} from '@angular/core';
import {GroupMainComponent} from "../group-main/group-main.component";
import {ParticipantsComponent} from "./participants/participants.component";
import {GroupOptionsComponent} from "./group-options/group-options.component";
import {QuizListComponent} from "./quiz-list/quiz-list.component";
import {GroupNameComponent} from "./group-name/group-name.component";

@Component({
  selector: 'app-group-utilities',
  standalone: true,
  imports: [
    GroupMainComponent,
    ParticipantsComponent,
    GroupOptionsComponent,
    QuizListComponent,
    GroupNameComponent
  ],
  templateUrl: './group-utilities.component.html',
  styleUrl: './group-utilities.component.scss'
})

export class GroupUtilitiesComponent {

}
