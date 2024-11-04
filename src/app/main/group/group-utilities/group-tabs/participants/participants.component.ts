import {Component} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {GroupDataService} from "../../../../../states/group-data.service";
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatCardContent,
    MatList,
    MatListItem,
    MatCardTitle,
    MatTooltip,
  ],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss'
})
export class ParticipantsComponent {
  constructor(public groupDataService : GroupDataService) { }

  showStatus(status : string) {
    console.log(status);
  }
}
