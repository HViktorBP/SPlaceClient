import {Component, OnInit} from '@angular/core';
import {UsersDataService} from "../../../services/users-data.service";
import {Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-group-name',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './group-name.component.html',
  styleUrl: './group-name.component.scss'
})
export class GroupNameComponent implements OnInit {
  groupName$ !: Observable<string>;
  count$ !: Observable<number>;

  constructor(private usesDataService : UsersDataService) {

  }

  ngOnInit() {
    this.groupName$ = this.usesDataService.groupName$
    this.count$ = this.usesDataService.userCount$
  }
}
