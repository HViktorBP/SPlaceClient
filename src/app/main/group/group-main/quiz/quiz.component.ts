import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css'
})
export class QuizComponent {
  quizes: string[] = ['One', 'Two']

}
