import {Component} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {GroupDataService} from "../../../../states/group-data.service";

@Component({
  selector: 'app-group-name',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './group-name.component.html',
  styleUrl: './group-name.component.scss'
})
export class GroupNameComponent {

  constructor(public groupDataService : GroupDataService) { }

}
