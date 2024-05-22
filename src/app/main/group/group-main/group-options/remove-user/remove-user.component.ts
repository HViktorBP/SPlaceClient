import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUserMinus} from "@fortawesome/free-solid-svg-icons";
import {FormsModule} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../../../../services/user.service";
import {GroupsService} from "../../../../../services/groups.service";
import {ActivatedRoute} from "@angular/router";
import {GroupHubService} from "../../../../../services/group-hub.service";
import {NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-remove-user',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent,
    FormsModule
  ],
  templateUrl: './remove-user.component.html',
  styleUrl: './remove-user.component.css'
})
export class RemoveUserComponent {
  icon = faUserMinus;
  closeResult : string = ''
  constructor(private auth : UserService,
              private group : GroupsService,
              private modalService : NgbModal,
              private route : ActivatedRoute,
              private groupHub : GroupHubService,
              private toast : NgToastService) {
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

  onSubmit(userName : string, usersRole: string) {
    const id = +this.route.snapshot.paramMap.get('id')!
    this.auth.getUserID(userName).subscribe({
      next:userToDeleteID => {
        this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
          this.group.getUserRole(userID, id).subscribe(role => {
            this.group.deleteUserFromGroup(userToDeleteID, id, usersRole, role).subscribe({
              next: res => {
                this.auth.getUserByID(userToDeleteID).subscribe(user => {
                  this.groupHub.removeUserFromGroup(user.username, id.toString())
                    .then(() => {
                      this.modalService.dismissAll()
                      this.toast.info({detail:"Info", summary: "User successfully removed!", duration:3000})
                    })
                })
              },
              error: err => {
                this.toast.error({detail:"Error", summary: err.error.message, duration:3000})
              }
            })
          })
        })

      },
      error:err => {
        this.toast.error({detail:"Error", summary: err.error.message, duration:3000})
      }
    })
  }
}
