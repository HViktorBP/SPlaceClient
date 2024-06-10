import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {UsersDataService} from "../../../../services/users-data.service";

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.scss'
})
export class ParticipantsComponent implements OnInit {
  participants! : string[];

  constructor(private usesDataService : UsersDataService) {

  }

  ngOnInit() {
    this.usesDataService.userList$.subscribe(list => this.participants = list)
  }
}
