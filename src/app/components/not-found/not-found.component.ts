import {Component} from '@angular/core';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";

/**
 * NotFoundComponent is shown when user tries to access page that has not been registered in router.
 */

@Component({
    selector: 'app-not-found',
    imports: [
        MatCard,
        MatCardHeader,
        MatIcon,
        MatCardContent,
        MatCardActions,
        MatButton,
        RouterLink,
        MatCardActions,
        MatCardTitle,
    ],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss'
})

export class NotFoundComponent {

}
