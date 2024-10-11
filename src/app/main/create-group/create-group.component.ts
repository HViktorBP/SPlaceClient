import { Component } from '@angular/core';
import {GroupsService} from "../../services/groups.service";
import {UserService} from "../../services/user.service";
import {CreateGroup} from "../../contracts/group/create-group";
import {FormsModule, NgForm} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {PopUpService} from "../../services/pop-up.service";

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss'
})
export class CreateGroupComponent {
  constructor(private groupService : GroupsService,
              private popUpService : PopUpService,
              private toast : NgToastService,
              private userService : UserService) {

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

  onSubmit(form : NgForm) {
    const userId = this.userService.getUserId()

    const createGroupRequest : CreateGroup = {
      userId : userId,
      groupName : form.value.groupName
    }

    this.groupService.createGroup(createGroupRequest).subscribe({
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
