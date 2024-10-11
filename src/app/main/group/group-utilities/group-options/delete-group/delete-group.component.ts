import { Component } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faTrashArrowUp} from "@fortawesome/free-solid-svg-icons/faTrashArrowUp";
import {GroupsService} from "../../../../../services/groups.service";
import {UsersDataService} from "../../../../../states/users-data.service";
import {UserService} from "../../../../../services/user.service";
import {NgToastService} from "ng-angular-popup";
import {GroupHubService} from "../../../../../services/group-hub.service";
import {ActivatedRoute, Router} from "@angular/router";
import {faPeopleArrows} from "@fortawesome/free-solid-svg-icons/faPeopleArrows";
import {PopUpService} from "../../../../../services/pop-up.service";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {ChangeRole} from "../../../../../contracts/group/change-role";
import {UserGroup} from "../../../../../contracts/group/user-group";

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

  constructor(private userService : UserService,
              private groupService : GroupsService,
              public popUpService : PopUpService,
              private toast : NgToastService,
              private route : ActivatedRoute,
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
    const groupId : number = +this.route.snapshot.paramMap.get('id')!
    const userId : number = this.userService.getUserId()

    const deleteGroupRequest : UserGroup = {
      userId : userId,
      groupId : groupId,
    }

    const deleteGroupSubscription = this.groupService.deleteGroup(deleteGroupRequest).subscribe({
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
