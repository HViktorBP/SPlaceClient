import { Component } from '@angular/core';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {ParticipantsComponent} from "./participants/participants.component";
import {ScoresComponent} from "./scores/scores.component";

@Component({
  selector: 'app-group-tabs',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab,
    ParticipantsComponent,
    ScoresComponent
  ],
  templateUrl: './group-tabs.component.html',
  styleUrl: './group-tabs.component.scss'
})
export class GroupTabsComponent {

}
