import { Component } from '@angular/core';

@Component({
  selector: 'app-group-name',
  standalone: true,
  imports: [],
  templateUrl: './group-name.component.html',
  styleUrl: './group-name.component.css'
})
export class GroupNameComponent {
  amount: number = 10;
}
