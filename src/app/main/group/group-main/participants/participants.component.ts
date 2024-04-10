import { Component } from '@angular/core';
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-participants',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './participants.component.html',
  styleUrl: './participants.component.css'
})
export class ParticipantsComponent {
  participants: string[] = ['Hello00000000000000000000000000000000000', 'Its', 'me','Hello', 'Its', 'me','Hello', 'Its', 'me','Hello', 'Its', 'me','Hello', 'Its', 'me','Hello', 'Its', 'me','Hello', 'Its', 'me']
  amount = 10111
}
