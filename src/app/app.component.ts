import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MainComponent} from "./components/main/main.component";
import {NgToastModule} from "ng-angular-popup";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent, NgToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent{

}
