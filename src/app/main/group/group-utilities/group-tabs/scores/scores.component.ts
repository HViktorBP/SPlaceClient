import { Component } from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";
import {GroupDataService} from "../../../../../states/group-data.service";
import {MatTab, MatTabGroup} from "@angular/material/tabs";

@Component({
  selector: 'app-scores',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCard,
    MatCardContent,
    MatCardHeader,
    MatCardTitle,
    MatList,
    MatListItem,
    NgForOf,
    MatTabGroup,
    MatTab
  ],
  templateUrl: './scores.component.html',
  styleUrl: './scores.component.scss'
})
export class ScoresComponent {
  constructor(public groupDataService : GroupDataService) {
  }
}
