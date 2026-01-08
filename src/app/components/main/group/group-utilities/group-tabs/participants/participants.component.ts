import {Component} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {GroupDataService} from "../../../../../../services/states/group-data.service";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";
import {MatTooltip} from "@angular/material/tooltip";

/**
 * ParticipantsComponent displays the list of people who participate in group.
 */

@Component({
    selector: 'app-participants',
    imports: [
        NgForOf,
        AsyncPipe,
        MatCard,
        MatCardHeader,
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
}
