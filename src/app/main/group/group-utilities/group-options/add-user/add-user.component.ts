import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {faUserPlus} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GroupsService} from "../../../../../services/groups.service";
import {FormsModule, NgForm} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../../../../services/user.service";
import {NgToastService} from "ng-angular-popup";
import {ActivatedRoute} from "@angular/router";
import {AddUser} from "../../../../../contracts/group/add-user";
import {PopUpService} from "../../../../../services/pop-up.service";
@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent,
    FormsModule
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {
  icon = faUserPlus

  constructor(private userService : UserService,
              private groupService : GroupsService,
              public popUpService : PopUpService,
              private toast : NgToastService,
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
    const groupId : number = +this.route.snapshot.paramMap.get('id')!
    const userId : number = this.userService.getUserId()

    const addUserRequest : AddUser = {
      userId : userId,
      groupId : groupId,
      userToAddName : form.value.userName,
      role : +form.value.userRole
    }

    const addUserSubscription = this.groupService.addUser(addUserRequest).subscribe({
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
