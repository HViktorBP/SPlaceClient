import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatCard} from "@angular/material/card";

/**
 * AboutAppComponent provides user with brief information about the application itself: what's the purpose of it, main features and so on.
 */

@Component({
    selector: 'app-about-app',
    imports: [
        FormsModule,
        MatButton,
        MatDialogActions,
        MatDialogContent,
        MatCard,
    ],
    templateUrl: './about-app.component.html',
    styleUrl: './about-app.component.scss'
})
export class AboutAppComponent {
  /**
   * Description: Reference to the component that will be opened in dialog
   */
  readonly dialogRef = inject(MatDialogRef<AboutAppComponent>)
}
