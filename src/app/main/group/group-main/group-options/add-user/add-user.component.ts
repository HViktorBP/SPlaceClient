import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {faUserPlus} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GroupsService} from "../../../../../services/groups.service";
import {FormsModule} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../../../../services/user.service";
import {NgToastService} from "ng-angular-popup";
import {ActivatedRoute} from "@angular/router";
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
  icon = faUserPlus;
  closeResult : string = ''

  constructor(private auth : UserService,
              private group : GroupsService,
              private modalService : NgbModal,
              private toast : NgToastService,
              private route : ActivatedRoute) {
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
    const groupId : number = +this.route.snapshot.paramMap.get('id')!
      this.auth.getUserID(userName).subscribe( {
        next: userID => {
          this.auth.getUserID(this.auth.getUsername()).subscribe(userIDCurrent => {
            this.group.getUserRole(userIDCurrent, groupId).subscribe(currentUserRole => {
              this.group.addUserInGroup(userID, groupId, role, currentUserRole).subscribe({
                next: () => {
                  this.modalService.dismissAll()
                },
                error: err => {
                  this.toast.error({detail:"Error", summary: err.error.message, duration: 3000})
                }
              })
            })
          })
        },
        error : err => {
          this.toast.error({detail:"Error", summary: err.error.message, duration: 3000})
        }
      })
    }
}
