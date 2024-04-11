import {Component, Input} from '@angular/core';
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
  @Input({required: true}) participants! : string[];
}
