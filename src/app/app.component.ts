import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MenuComponent} from "./main/side-bar/menu/menu.component";
import {MainBarComponent} from "./main/main-bar/main-bar.component";
import {SideBarComponent} from "./main/side-bar/side-bar.component";
import {MainComponent} from "./main/main.component";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, MainBarComponent, SideBarComponent, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SPlace';
}
