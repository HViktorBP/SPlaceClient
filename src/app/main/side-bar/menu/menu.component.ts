import {Component} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {NgIf} from "@angular/common";
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(-100%, 0, 0)'
      })),
      transition('in => out', animate('4s ease-in-out')),
      transition('out => in', animate('4s ease-in-out'))
    ])
  ]
})
export class MenuComponent {
  isOpen = false;
  menuSliding : string = '';
  toggleMenu() {
    this.isOpen = !this.isOpen;
    this.menuSliding = this.isOpen ? 'out' : 'in';
  }
}
