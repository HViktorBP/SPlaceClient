import {Component} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {UserDataService} from "../../../../services/states/user-data.service";
import {MatCard} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";
import {MatLine} from "@angular/material/core";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";

/**
 * CreatedGroupsComponent displays the groups created by user
 */

@Component({
    selector: 'app-created-groups',
    imports: [
        NgForOf,
        RouterLink,
        AsyncPipe,
        MatCard,
        MatList,
        MatListItem,
        MatLine,
        MatDivider,
        MatIcon
    ],
    templateUrl: './created-groups.component.html',
    styleUrl: '../../../../custom/styles/info-list-box.scss'
})


export class CreatedGroupsComponent {

  constructor(public userData : UserDataService) {

  }
}
