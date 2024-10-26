import {Component, inject, Input} from '@angular/core';
import {AddUserComponent} from "./add-user/add-user.component";
import {RemoveUserComponent} from "./remove-user/remove-user.component";
import {LeaveGroupComponent} from "./leave-group/leave-group.component";
import {DeleteGroupComponent} from "./delete-group/delete-group.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {ChangeRoleComponent} from "./change-role/change-role.component";
import {RenameGroupComponent} from "./rename-group/rename-group.component";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatDialog} from "@angular/material/dialog";

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
    MatCard,
    MatCardContent,
  ],
  templateUrl: './group-options.component.html',
  styleUrl: './group-options.component.scss'
})
export class GroupOptionsComponent{
  readonly dialog = inject(MatDialog);
  @Input()isCreator!: boolean;
  @Input()isAdministrator!: boolean;
  @Input()isModerator!: boolean;
  @Input()isParticipant!: boolean;

  onAddUser() {
    this.dialog.open(AddUserComponent)
  }

  onRemoveUser() {
    this.dialog.open(RemoveUserComponent)
  }

  onChangeRole() {
    this.dialog.open(ChangeRoleComponent)
  }

  onRenameGroup() {
    this.dialog.open(RenameGroupComponent)
  }

  onDeleteGroup() {
    this.dialog.open(DeleteGroupComponent)
  }

  onLeaveGroup() {
    this.dialog.open(LeaveGroupComponent)
  }
}
