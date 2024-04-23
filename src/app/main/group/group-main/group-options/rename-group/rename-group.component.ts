import { Component } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-rename-group',
  standalone: true,
    imports: [
        FaIconComponent
    ],
  templateUrl: './rename-group.component.html',
  styleUrl: './rename-group.component.css'
})
export class RenameGroupComponent {
  icon = faPen
}
