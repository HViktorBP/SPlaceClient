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
import {MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {Role} from "../../../../../data-transferring/enums/role";

/**
 * GroupOptionsComponent displays possible operations that user can perform in group
 */

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
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './group-options.component.html',
  styleUrl: './group-options.component.scss'
})


export class GroupOptionsComponent{
  /**
   * Description: variable to work with MatDialogs
   */
  readonly dialog = inject(MatDialog);

  /**
   * Description: user's role
   */
  @Input()role!: Role;

  /**
   * Description: roles in the group
   * @protected
   */
  protected readonly Role = Role;

  /**
   * Description: Method onAddUser opens an AddUserComponent in MatDialog
   * @see AddUserComponent
   * @memberOf GroupOptionsComponent
   */
  onAddUser() {
    this.dialog.open(AddUserComponent)
  }

  /**
   * Description: Method onRemoveUser opens an RemoveUserComponent in MatDialog
   * @see RemoveUserComponent
   * @memberOf GroupOptionsComponent
   */
  onRemoveUser() {
    this.dialog.open(RemoveUserComponent)
  }

  /**
   * Description: Method onChangeRole opens an ChangeRoleComponent in MatDialog
   * @see ChangeRoleComponent
   * @memberOf GroupOptionsComponent
   */
  onChangeRole() {
    this.dialog.open(ChangeRoleComponent)
  }

  /**
   * Description: Method onRenameGroup opens an RenameGroupComponent in MatDialog
   * @see RenameGroupComponent
   * @memberOf GroupOptionsComponent
   */
  onRenameGroup() {
    this.dialog.open(RenameGroupComponent)
  }

  /**
   * Description: Method onDeleteGroup opens an DeleteGroupComponent in MatDialog
   * @see DeleteGroupComponent
   * @memberOf GroupOptionsComponent
   */
  onDeleteGroup() {
    this.dialog.open(DeleteGroupComponent)
  }

  /**
   * Description: Method onLeaveGroup opens an LeaveGroupComponent in MatDialog
   * @see LeaveGroupComponent
   * @memberOf GroupOptionsComponent
   */
  onLeaveGroup() {
    this.dialog.open(LeaveGroupComponent)
  }
}
