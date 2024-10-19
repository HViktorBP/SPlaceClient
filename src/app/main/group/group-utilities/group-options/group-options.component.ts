import {Component, Input} from '@angular/core';
import {AddUserComponent} from "./add-user/add-user.component";
import {RemoveUserComponent} from "./remove-user/remove-user.component";
import {LeaveGroupComponent} from "./leave-group/leave-group.component";
import {DeleteGroupComponent} from "./delete-group/delete-group.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {ChangeRoleComponent} from "./change-role/change-role.component";
import {RenameGroupComponent} from "./rename-group/rename-group.component";

@Component({
  selector: 'app-group-options',
  standalone: true,
  imports: [
    AddUserComponent,
    RemoveUserComponent,
    LeaveGroupComponent,
    DeleteGroupComponent,
    NgIf,
    ChangeRoleComponent,
    AsyncPipe,
    RenameGroupComponent,
  ],
  templateUrl: './group-options.component.html',
  styleUrl: './group-options.component.scss'
})
export class GroupOptionsComponent{
  @Input()isCreator!: boolean;
  @Input()isAdministrator!: boolean;
  @Input()isModerator!: boolean;
  @Input()isParticipant!: boolean;
}
