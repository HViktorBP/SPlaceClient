import {Component, OnInit} from '@angular/core';
import {UsersDataService} from "../../../services/users-data.service";

@Component({
  selector: 'app-group-name',
  standalone: true,
  imports: [],
  templateUrl: './group-name.component.html',
  styleUrl: './group-name.component.scss'
})
export class GroupNameComponent implements OnInit {
  groupName! : string;
  count! : number;

  constructor(private usesDataService : UsersDataService) {

  }

  ngOnInit() {
    this.usesDataService.userCount$.subscribe(list => this.count = list)
    this.usesDataService.groupName$.subscribe(grpName => this.groupName = grpName)
  }
}
