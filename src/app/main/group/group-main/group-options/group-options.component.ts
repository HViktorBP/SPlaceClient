import { Component } from '@angular/core';
import {AddUserComponent} from "./add-user/add-user.component";
import {RemoveUserComponent} from "./remove-user/remove-user.component";
import {LeaveGroupComponent} from "./leave-group/leave-group.component";
import {AddQuizComponent} from "./add-quiz/add-quiz.component";

@Component({
  selector: 'app-group-options',
  standalone: true,
  imports: [
    AddUserComponent,
    RemoveUserComponent,
    LeaveGroupComponent,
    AddQuizComponent
  ],
  templateUrl: './group-options.component.html',
  styleUrl: './group-options.component.css'
})
export class GroupOptionsComponent {

}
