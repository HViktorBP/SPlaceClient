import { Component } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {UsersService} from "../../../../../services/users.service";
import {GroupsService} from "../../../../../services/groups.service";
import {PopUpService} from "../../../../../services/pop-up.service";
import {NgToastService} from "ng-angular-popup";
import {ActivatedRoute} from "@angular/router";
import {AddUser} from "../../../../../contracts/group/add-user";
import {faPeopleArrows} from "@fortawesome/free-solid-svg-icons/faPeopleArrows";
import {ChangeRole} from "../../../../../contracts/group/change-role";
import {GroupDataService} from "../../../../../states/group-data.service";

@Component({
  selector: 'app-change-role',
  standalone: true,
    imports: [
        FaIconComponent,
        FormsModule,
        ReactiveFormsModule
    ],
  templateUrl: './change-role.component.html',
  styleUrl: './change-role.component.scss'
})
export class ChangeRoleComponent {
  icon = faPeopleArrows

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              public popUpService : PopUpService,
              private toast : NgToastService,
              private groupDataService : GroupDataService,
              private route : ActivatedRoute) {
  }

  open(content: any) {
    this.popUpService.openModal(content).then(
      (result) => {
        this.onSubmit(result);
      },
      (reason) => {
        console.log(`Dismissed ${this.popUpService.getDismissReason(reason)}`);
      }
    );
  }

  onSubmit(form: NgForm) {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    const addUserRequest : ChangeRole = {
      userId : userId,
      groupId : groupId,
      userName : form.value.userName,
      role : +form.value.userRole
    }

    const changeUserRoleSubscription = this.groupService.changeRole(addUserRequest).subscribe({
      next : res => {
        this.toast.success({detail:"Info", summary: res, duration:3000})
        this.popUpService.dismissThePopup()
      },
      error : err => {
        this.toast.error({detail:"Error", summary: err, duration:3000})
      }
    })
  }
}
