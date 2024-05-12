import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUserMinus} from "@fortawesome/free-solid-svg-icons";
import {FormsModule} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../../../../services/user.service";
import {GroupsService} from "../../../../../services/groups.service";
import {ActivatedRoute} from "@angular/router";
import {UsersDataService} from "../../../../../services/users-data.service";
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {User} from "../../../../../interfaces/user";
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
              private usersDataService : UsersDataService,
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

  onSubmit(userName : string, role: string) {
    const id = +this.route.snapshot.paramMap.get('id')!
    this.auth.getUserID(userName).subscribe({
      next:userID => {
        console.log(userID, id, role)
        this.group.deleteUserFromGroup(userID, id, role).subscribe({
          next: res => {
            this.auth.getUserByID(userID).subscribe(user => {
              this.groupHub.removeUserFromGroup(user.username, id.toString())
                .then(() => this.toast.success({detail: "Success", summary: `User '${user.username}' removed from group`, duration: 3000}))
                .catch(err => this.toast.error({detail: "In proccess", summary: err.error.message, duration: 3000}))
            })

            this.group.getUsersInGroup(id).pipe(
              switchMap(usersID => {
                const observables: Observable<User>[] = usersID.map(id => this.auth.getUserByID(id))
                return forkJoin(observables).pipe(
                  map(usersData => usersData.map(user => user.username))
                )
              })
            ).subscribe(users => {
              this.usersDataService.updateUserCount(users.length)
              this.usersDataService.updateUsersList(users)
            })
            this.modalService.dismissAll()
          },
          error: err => {
            this.toast.error({detail:"Error", summary: err.error.message, duration:3000})
          }
        })
      },
      error:err => {
        this.toast.error({detail:"Error", summary: err.error.message, duration:3000})
      }
    })
  }
}
