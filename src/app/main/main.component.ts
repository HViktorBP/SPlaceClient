import { Component } from '@angular/core';
import {MainBarComponent} from "./main-bar/main-bar.component";
import {SideBarComponent} from "./side-bar/side-bar.component";
import {RouterOutlet} from "@angular/router";
import {HomeComponent} from "./home/home.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MainBarComponent,
    SideBarComponent,
    RouterOutlet,
    HomeComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
