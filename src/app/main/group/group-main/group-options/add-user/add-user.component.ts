import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {faUserPlus} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GroupsService} from "../../../../../services/groups.service";
import {FormsModule} from "@angular/forms";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {AuthorisationService} from "../../../../../services/authorisation.service";
import {ActivatedRoute} from "@angular/router";
import {UsersDataService} from "../../../../../services/users-data.service";
import {forkJoin, map, Observable, switchMap} from "rxjs";
import {User} from "../../../../../interfaces/user";
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

  constructor(private auth : AuthorisationService,
              private group : GroupsService,
              private modalService : NgbModal,
              private route : ActivatedRoute,
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

  onSubmit(userName : string, role: string) {
    const id = +this.route.snapshot.paramMap.get('id')!
    this.auth.getUserID(userName).subscribe(userID => {
      console.log(userID, id, role)
      this.group.addUserInGroup(userID, id, role).subscribe({
        next: message => {
          console.log(message.message)
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
          console.log(err.error.message)
        }
      })
    })
  }
}
