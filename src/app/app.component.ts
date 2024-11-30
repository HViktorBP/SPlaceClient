import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MainComponent} from "./components/main/main.component";
import {NgToastModule} from "ng-angular-popup";

/**
 * AppComponent is the entry point of the application.
 * Here a toast service and main router are provided.
 */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent, NgToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent{

}
