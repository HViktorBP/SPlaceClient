import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-options-redirect',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './options-redirect.component.html',
  styleUrl: './options-redirect.component.scss'
})
export class OptionsRedirectComponent {

}
