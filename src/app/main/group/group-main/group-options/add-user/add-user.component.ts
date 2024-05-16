import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {faUserPlus} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GroupsService} from "../../../../../services/groups.service";
import {FormsModule} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../../../../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {UsersDataService} from "../../../../../services/users-data.service";
import {NgToastService} from "ng-angular-popup";
import {GroupHubService} from "../../../../../services/group-hub.service";
@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent,
    FormsModule
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent {
  icon = faUserPlus;
  closeResult : string = ''

  constructor(private auth : UserService,
              private group : GroupsService,
              private modalService : NgbModal,
              private route : ActivatedRoute,
              private usersDataService : UsersDataService,
              private toast : NgToastService,
              private groupHub : GroupHubService) {
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(userName : string, role: string) {
    this.usersDataService.groupId$.subscribe(id => {
      this.auth.getUserID(userName).subscribe( {
        next: userID => {
          this.group.addUserInGroup(userID, id, role).subscribe({
            next: res => {
              this.groupHub.joinChat(userName, id.toString()).then(
                () => {
                  this.modalService.dismissAll()
                }
              )
              this.toast.success({detail:"Success", summary: res.message, duration: 3000})
            },
            error: err => {
              this.toast.error({detail:"Error", summary: err.error.message, duration: 3000})
            }
          })
        },
        error : err => {
          this.toast.error({detail:"Error", summary: err.error.message, duration: 3000})
        }
      })
    })
  }
}
