import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NgToastModule} from "ng-angular-popup";

/**
 * AppComponent is the entry point of the application.
 * Here a toast service and main router are provided.
 */

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, NgToastModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})

export class AppComponent{

}
