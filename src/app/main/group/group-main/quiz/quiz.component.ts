import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {UsersDataService} from "../../../../services/users-data.service";
import {QuizesDTO} from "../../../../interfaces/quizes-dto";

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent implements OnInit {
  quizes : QuizesDTO[] = []
  constructor(private userDataSrvice : UsersDataService) {
  }

  ngOnInit() {
    this.userDataSrvice.quizList$.subscribe(list => this.quizes = list)
  }

  onQuizOpened(quiz : QuizesDTO) {
    console.log(quiz.name, quiz.groupID, quiz.creatorID)
  }
}
