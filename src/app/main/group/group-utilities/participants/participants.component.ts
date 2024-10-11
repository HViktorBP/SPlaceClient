import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {UsersDataService} from "../../../../states/users-data.service";
import {Observable} from "rxjs";
import {GroupDataService} from "../../../../states/group-data.service";

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [
    NgForOf,
    AsyncPipe
  ],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss'
})
export class ParticipantsComponent {
  constructor(public groupDataService : GroupDataService) { }

}
