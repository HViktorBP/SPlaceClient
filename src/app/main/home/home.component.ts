import {Component, OnInit} from '@angular/core';
import {InfoComponent} from "./info/info.component";
import {QuizInfoComponent} from "./quiz-info/quiz-info.component";
import {GroupsInfoComponent} from "./groups-info/groups-info.component";
import {UsersDataService} from "../../services/users-data.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    InfoComponent,
    QuizInfoComponent,
    GroupsInfoComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  constructor(private userData : UsersDataService) {

  }

  ngOnInit() {
    this.userData.updateGroupId(0)
    this.userData.updateUserRole('')
  }
}
