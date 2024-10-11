import {Component} from '@angular/core';
import {UsersService} from "../../../../../services/users.service";
import {GroupsService} from "../../../../../services/groups.service";
import {PopUpService} from "../../../../../services/pop-up.service";
import {NgToastService} from "ng-angular-popup";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {faPenToSquare} from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RenameGroup} from "../../../../../contracts/group/rename-group";
import {GroupDataService} from "../../../../../states/group-data.service";

@Component({
  selector: 'app-rename-group',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './rename-group.component.html',
  styleUrl: './rename-group.component.scss'
})

export class RenameGroupComponent {
  icon = faPenToSquare

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              public popUpService : PopUpService,
              private toast : NgToastService,
              private groupDataService : GroupDataService) { }

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

    const renameGroupRequest : RenameGroup = {
      userId : userId,
      groupId : groupId,
      newGroupName : form.value.groupName,
    }

    const renameGroupSubscription = this.groupService.renameGroup(renameGroupRequest).subscribe({
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
