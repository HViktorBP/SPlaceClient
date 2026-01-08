import {Component, Input} from '@angular/core';
import {AsyncPipe, JsonPipe, KeyValuePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialog} from '@angular/material/dialog';
import {GroupDataService} from "../../../../../services/states/group-data.service";
import {CreateQuizComponent} from "./create-quiz/create-quiz.component";
import {RouterLink} from "@angular/router";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {MatButton, MatIconButton} from "@angular/material/button";
import {DeleteQuizComponent} from "./delete-quiz/delete-quiz.component";
import {EditQuizComponent} from "./edit-quiz/edit-quiz.component";
import {ApplicationHubService} from "../../../../../services/application-hub.service";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatList, MatListItem} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {Role} from "../../../../../data-transferring/enums/role";

/**
 * QuizListComponent displays the list of quizzes in the group as well as providing UI for managing them.
 */

@Component({
    selector: 'app-quiz-list',
    imports: [
        NgForOf,
        FormsModule,
        ReactiveFormsModule,
        JsonPipe,
        NgIf,
        KeyValuePipe,
        AsyncPipe,
        RouterLink,
        FaIconComponent,
        MatButton,
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatCardTitle,
        MatList,
        MatListItem,
        MatIconButton,
        MatIcon,
    ],
    templateUrl: './quiz-list.component.html',
    styleUrl: './quiz-list.component.scss'
})

export class QuizListComponent {
  /**
   * Description: User's role.
   */
  @Input()role!:Role

  /**
   * Description: Roles in group.
   * @protected
   */
  protected readonly Role = Role;

  constructor(public groupDataService : GroupDataService,
              public dialog: MatDialog,
              public applicationHubService : ApplicationHubService) { }

  /**
   * Description: onCreateQuiz method opens the CreateQuizComponent in MatDialog.
   * @memberOf QuizListComponent
   */
  onCreateQuiz() {
    this.dialog.open(CreateQuizComponent, {
      width: '50vw'
    });
  }

  /**
   * Description: onDeleteQuiz method opens the DeleteQuizComponent in MatDialog.
   * @memberOf QuizListComponent
   */
  onDeleteQuiz(quizName: string, quizId: number): void {
    this.dialog.open(DeleteQuizComponent, {
        data: {
          quizName: quizName,
          quizId: quizId
        }
      })
  }

  /**
   * Description: onEditQuiz method opens the EditQuizComponent in MatDialog.
   * @memberOf QuizListComponent
   */
  onEditQuiz(quizId : number) {
    this.dialog.open(EditQuizComponent, {
      width: '50vw',
      data: { quizId: quizId }
    })
  }
}
