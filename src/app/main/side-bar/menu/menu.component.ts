import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {AuthorisationService} from "../../../services/authorisation.service";
import {GroupsService} from "../../../services/groups.service";
import {RouterLink} from "@angular/router";
import {BehaviorSubject, forkJoin, map, Observable, switchMap} from "rxjs";
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap'
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    FormsModule,
    AsyncPipe
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})

export class MenuComponent implements OnInit {
  menuSliding : string = 'in'
  userGroupData: { name: string; id: number }[]= []
  userGroupData$: BehaviorSubject<{ name: string; id: number }[]> = new BehaviorSubject<{name: string; id: number}[]>([])
  closeResult : string = ''

  constructor(private auth: AuthorisationService, private groups : GroupsService, private modalService : NgbModal) {

  }

  ngOnInit(): void {
    this.updateData()
  }

  updateData() {
    this.userGroupData.length = 0
    this.auth.getUserID(this.auth.getUsername()).pipe(
      switchMap(userID => this.groups.getGroups(userID)),
      switchMap(groups => {
        const observables: Observable<{ name: string; id: number }>[] = groups.map(groupID => {
          return this.groups.getGroupById(groupID).pipe(
            map(groupName => ({ id: groupID, name: groupName }))
          );
        });
        return forkJoin(observables);
      })
    ).subscribe(groupInfos => {
      console.log(groupInfos)
      this.userGroupData.push(...groupInfos);
      this.userGroupData$.next(this.userGroupData)
    })

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
    this.toggleMenu()
  }

  onSubmit(groupName : string) {
    this.auth.getUserID(this.auth.getUsername()).subscribe(res => {
      this.groups.addGroup(res, groupName).subscribe( {
        next: res => {
          console.log(res.message)
          this.updateData()
          this.toggleMenu()
        },
        error: err => {
          console.log(err.error.message)
        }
      })
    })
    this.modalService.dismissAll();
  }
}
