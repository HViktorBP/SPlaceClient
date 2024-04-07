import {Component} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})

export class MenuComponent {
  groups: string[] = ['First', 'Second', 'Third']
  menuSliding : string = 'in';
  toggleMenu() {
    this.menuSliding = this.menuSliding == 'in' ? 'out' : 'in';
  }

  addGroup() {

  }
}
