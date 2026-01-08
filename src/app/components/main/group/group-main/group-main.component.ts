import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {RouterOutlet} from "@angular/router";

/**
 * GroupMainComponent contains the secondary router for displaying a components such as chat or quiz.
 * @see ChatComponent
 * @see QuizComponent
 */
@Component({
    selector: 'app-group-main',
    imports: [
        FormsModule,
        RouterOutlet
    ],
    templateUrl: './group-main.component.html',
    styleUrl: './group-main.component.scss'
})

export class GroupMainComponent {
}
