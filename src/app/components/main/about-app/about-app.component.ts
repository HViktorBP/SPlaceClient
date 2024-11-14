import {Component, inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input"

/**
 * AboutAppComponent provides user with brief information about the application itself: what's the purpose of it, main features and so on.
 */

@Component({
  selector: 'app-about-app',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel
  ],
  templateUrl: './about-app.component.html',
  styleUrl: './about-app.component.scss'
})
export class AboutAppComponent {
  /**
   * Description: Reference to the component that will be opened in dialog
   */
  readonly dialogRef = inject(MatDialogRef<AboutAppComponent>);
}
