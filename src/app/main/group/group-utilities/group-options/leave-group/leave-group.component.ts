import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GroupsService} from "../../../../../services/groups.service";
import {UserService} from "../../../../../services/user.service";
import {GroupHubService} from "../../../../../services/group-hub.service";
import {NgToastService} from "ng-angular-popup";
import {PopUpService} from "../../../../../services/pop-up.service";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {AddUser} from "../../../../../contracts/group/add-user";
import {UserGroup} from "../../../../../contracts/group/user-group";

@Component({
  selector: 'app-leave-group',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './leave-group.component.html',
  styleUrl: './leave-group.component.scss'
})
export class LeaveGroupComponent {
  icon = faRightFromBracket

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

    const leaveGroupRequest : UserGroup = {
      userId : userId,
      groupId : groupId
    }

    this.groupService.leaveGroup(leaveGroupRequest).subscribe({
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
