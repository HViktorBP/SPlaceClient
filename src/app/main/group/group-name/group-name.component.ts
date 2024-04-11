import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-group-name',
  standalone: true,
  imports: [],
  templateUrl: './group-name.component.html',
  styleUrl: './group-name.component.css'
})
export class GroupNameComponent {
  @Input({required: true}) groupName! : string;
  @Input({required: true}) amount! : number;
}
