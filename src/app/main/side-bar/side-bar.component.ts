import { Component } from '@angular/core';
import {MenuComponent} from "./menu/menu.component";
import {OptionsComponent} from "./options/options.component";

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    MenuComponent,
    OptionsComponent
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent {

}
