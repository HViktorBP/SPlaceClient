import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink
  ],
  templateUrl: './options.component.html',
  styleUrl: './options.component.scss'
})
export class OptionsComponent {

}
