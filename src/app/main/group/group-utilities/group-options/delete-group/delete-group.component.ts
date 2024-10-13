import {Component} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faTrashArrowUp} from "@fortawesome/free-solid-svg-icons/faTrashArrowUp";
import {GroupsService} from "../../../../../services/groups.service";
import {UsersService} from "../../../../../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {Router} from "@angular/router";
import {PopUpService} from "../../../../../services/pop-up.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserGroup} from "../../../../../contracts/group/user-group";
import {GroupDataService} from "../../../../../states/group-data.service";
import {take} from "rxjs";

@Component({
  selector: 'app-delete-group',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './delete-group.component.html',
  styleUrl: './delete-group.component.scss'
})
export class DeleteGroupComponent {
  icon = faTrashArrowUp

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private groupDataService : GroupDataService,
              public popUpService : PopUpService,
              private toast : NgToastService,
              private router : Router) {
  }

  open(content: any) {
    this.popUpService.openModal(content).then(
      () => {
        this.onSubmit();
      },
      (reason) => {
        console.log(`Dismissed ${this.popUpService.getDismissReason(reason)}`);
      }
    );
  }

  onSubmit() {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    const deleteGroupRequest : UserGroup = {
      userId : userId,
      groupId : groupId,
    }

    this.groupService.deleteGroup(deleteGroupRequest)
      .pipe(take(1))
      .subscribe({
        next : res => {
          this.toast.success({detail:"Info", summary: res, duration:3000})
          this.router.navigate(['main/home']).then(
            () => this.popUpService.dismissThePopup()
          )
        },
        error : err => {
          this.toast.error({detail:"Error", summary: err, duration:3000})
        }
      })
  }
}
