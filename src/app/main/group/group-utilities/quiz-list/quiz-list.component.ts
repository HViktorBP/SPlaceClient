import {Component} from '@angular/core';
import {AsyncPipe, JsonPipe, KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {MatDialog} from '@angular/material/dialog';
import {GroupDataService} from "../../../../states/group-data.service";
import { CreateQuizComponent } from "./create-quiz/create-quiz.component";

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
    NgIf,
    KeyValuePipe,
    AsyncPipe,
    FaIconComponent
  ],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.scss'
})
export class QuizListComponent  {

  constructor(public groupDataService : GroupDataService,
              public dialog: MatDialog) {
  }

  createQuiz() {
    const dialogRef = this.dialog.open(CreateQuizComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Quiz Data:', result);
      }
    });
  }
}
