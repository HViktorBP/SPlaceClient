import {Component} from '@angular/core';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterOutlet} from "@angular/router";
import {GroupDataService} from "../../../../services/states/group-data.service";

@Component({
  selector: 'app-group-main',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FormsModule,
    AsyncPipe,
    NgClass,
    DatePipe,
    NgIf,
    NgForOf,
    RouterOutlet
  ],
  templateUrl: './group-main.component.html',
  styleUrl: './group-main.component.scss'
})

export class GroupMainComponent {
  constructor(public groupDataService : GroupDataService) {

  }
}
