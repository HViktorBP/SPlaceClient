import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MenuComponent} from "./main/side-bar/menu/menu.component";
import {MainBarComponent} from "./main/main-bar/main-bar.component";
import {SideBarComponent} from "./main/side-bar/side-bar.component";
import {MainComponent} from "./main/main.component";
import {NgToastModule} from "ng-angular-popup";
import {AppHubService} from "./services/app-hub.service";
import {GroupHubService} from "./services/group-hub.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, MainBarComponent, SideBarComponent, MainComponent, NgToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent{
  constructor(private groupHub : GroupHubService,
              private appHub : AppHubService) {
    this.appHub.start().then(()=> {
      console.log('Connected to the app hub!')
    })
    this.groupHub.start().then(() => {console.log('Connected to the group hub!')})
  }
}
