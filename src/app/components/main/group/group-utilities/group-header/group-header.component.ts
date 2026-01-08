import {Component} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {GroupDataService} from "../../../../../services/states/group-data.service";

/**
 * GroupHeaderComponent displays the group's name and the amount of people that participate in it
 */
@Component({
    selector: 'app-group-header',
    imports: [
        AsyncPipe
    ],
    templateUrl: './group-header.component.html',
    styleUrl: './group-header.component.scss'
})
export class GroupHeaderComponent {

  constructor(public groupDataService : GroupDataService) { }

}
