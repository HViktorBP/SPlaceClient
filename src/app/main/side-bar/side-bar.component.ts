import { Component } from '@angular/core';
import {MenuComponent} from "./menu/menu.component";
import {OptionsRedirectComponent} from "./options-redirect/options-redirect.component";

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [
    MenuComponent,
    OptionsRedirectComponent
  ],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {

}
