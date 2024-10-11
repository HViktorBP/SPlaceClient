import {AfterContentInit, AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {AddUserComponent} from "./add-user/add-user.component";
import {RemoveUserComponent} from "./remove-user/remove-user.component";
import {LeaveGroupComponent} from "./leave-group/leave-group.component";
import {DeleteGroupComponent} from "./delete-group/delete-group.component";
import {AsyncPipe, NgIf} from "@angular/common";
import {ChangeRoleComponent} from "./change-role/change-role.component";
import {GroupDataService} from "../../../../states/group-data.service";
import {RenameGroupComponent} from "./rename-group/rename-group.component";
import {Subscription} from "rxjs";
import {Role} from "../../../../enums/role";

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
export class GroupOptionsComponent implements OnInit, OnDestroy{
  isCreator!: boolean;
  isAdministrator!: boolean;
  isModerator!: boolean;
  isParticipant!: boolean;
  roleSubscription!: Subscription;

  constructor(private groupDataService : GroupDataService) {

  }

  ngOnInit() {
    this.roleSubscription = this.groupDataService.userRoleAsync.subscribe(role => {
      this.setUserRole(role)
    })
  }


  ngOnDestroy() {
    this.roleSubscription.unsubscribe()
  }

  private setUserRole(role: Role) {
    switch (role) {
      case Role.Creator:
        this.isCreator = true;
        break
      case Role.Administrator:
        this.isAdministrator = true;
        break
      case Role.Moderator:
        this.isModerator = true;
        break
      default:
        this.isParticipant = true;
    }
  }
}
