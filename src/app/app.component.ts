import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MenuComponent} from "./main/side-bar/menu/menu.component";
import {MainBarComponent} from "./main/main-bar/main-bar.component";
import {SideBarComponent} from "./main/side-bar/side-bar.component";
import {MainComponent} from "./main/main.component";
import {NgToastModule} from "ng-angular-popup";
import {AppHubService} from "./services/app-hub.service";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, MainBarComponent, SideBarComponent, MainComponent, NgToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'SPlace';

  constructor(private appHub : AppHubService) {

  }

  ngOnInit() {
    this.appHub.start().then(
      () => {console.log('You are connected to the app hub!')}
    )
  }
}
