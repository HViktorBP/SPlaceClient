import { Component } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPen} from "@fortawesome/free-solid-svg-icons";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../../../../services/user.service";
import {GroupsService} from "../../../../../services/groups.service";
import {ActivatedRoute, Router} from "@angular/router";
import {UsersDataService} from "../../../../../services/users-data.service";

@Component({
  selector: 'app-rename-group',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './rename-group.component.html',
  styleUrl: './rename-group.component.css'
})
export class RenameGroupComponent {
  icon = faPen
  closeResult : string = ''
  constructor(private auth : UserService,
              private group : GroupsService,
              private modalService : NgbModal,
              private route : ActivatedRoute,
              private router : Router,
              private usersDataService : UsersDataService) {
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

  onSubmit(groupName : string) {
    const groupID = +this.route.snapshot.paramMap.get('id')!
    this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
      this.group.getUserRole(userID, groupID).subscribe(role => {
        console.log(userID, groupID, role[0])
        this.group.renameGroup(userID, groupID, role[0], groupName).subscribe({
          next: res => {
            console.log(res)
            this.usersDataService.updateGroupName(groupName)
            this.group.getGroupById(groupID).subscribe(groupName => {
              this.router.navigate([`main/group/${groupName}/${groupID}`])
              this.modalService.dismissAll()
            })
          },
          error: err => {
            console.log(err.message)
          }
        })
      })
    })
  }
}
