import {Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

/**
 * DeleteQuizComponent provides UI for deleting the quiz.
 */

@Component({
  selector: 'app-delete-quiz',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton
  ],
  templateUrl: './delete-quiz.component.html',
  styleUrl: './delete-quiz.component.scss'
})

export class DeleteQuizComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteQuizComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  /**
   * Description: cancel the deleting of quiz
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }

  /**
   * Description: confirming the deleting of quiz
   */
  onDelete(): void {
    this.dialogRef.close(true);
  }
}
