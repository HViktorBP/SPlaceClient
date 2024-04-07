import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {

}
