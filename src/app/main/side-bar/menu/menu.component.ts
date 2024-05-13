import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {UserService} from "../../../services/user.service";
import {GroupsService} from "../../../services/groups.service";
import {RouterLink} from "@angular/router";
import {BehaviorSubject, forkJoin, map, Observable, switchMap} from "rxjs";
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap'
import {FormsModule} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faBars, faDoorOpen} from "@fortawesome/free-solid-svg-icons";
import {NgToastService} from "ng-angular-popup";
import {UsersDataService} from "../../../services/users-data.service";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    FormsModule,
    AsyncPipe,
    FaIconComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})

export class MenuComponent implements OnInit {
  menuSliding : string = 'in'
  closeResult : string = ''
  menuIcon = faBars
  groupIcon = faDoorOpen
  groupsData : {name:string, id:number}[] = []
  constructor(private auth: UserService,
              private groups : GroupsService,
              private modalService : NgbModal,
              private toast : NgToastService,
              private userData : UsersDataService) {

  }

  ngOnInit(): void {
    this.userData.userGroupData$.subscribe(groupData => this.groupsData = groupData)

    this.userData.updateGroup(this.auth.getUsername())
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

  toggleMenu() {
    this.menuSliding = this.menuSliding == 'in' ? 'out' : 'in';
  }

  goToGroup() {
    this.menuSliding = this.menuSliding == 'in' ? 'out' : 'in';
  }

  onSubmit(groupName : string) {
    this.auth.getUserID(this.auth.getUsername()).subscribe(res => {
      this.groups.addGroup(res, groupName).subscribe( {
        next: res => {
          this.toast.success({detail:"Success", summary:res.message, duration: 3000})
          this.userData.updateGroup(this.auth.getUsername())
          this.toggleMenu()
        },
        error: err => {
          this.toast.error({detail:"Error", summary:err.error.message, duration: 3000})
        }
      })
    })
    this.modalService.dismissAll();
  }
}
