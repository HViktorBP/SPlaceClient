import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {UsersDataService} from "../../../../services/users-data.service";
import {Observable} from "rxjs";

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
export class ParticipantsComponent implements OnInit {
  participants$ !: Observable<string[]>;

  constructor(private usesDataService : UsersDataService) { }

  ngOnInit() {
    this.participants$ = this.usesDataService.userList$
  }
}
