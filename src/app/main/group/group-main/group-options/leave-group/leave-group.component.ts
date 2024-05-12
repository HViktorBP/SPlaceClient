import {Component} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {GroupsService} from "../../../../../services/groups.service";
import {UserService} from "../../../../../services/user.service";
import {catchError, of, switchMap} from "rxjs";
import {GroupHubService} from "../../../../../services/group-hub.service";

@Component({
  selector: 'app-leave-group',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent
  ],
  templateUrl: './leave-group.component.html',
  styleUrl: './leave-group.component.css'
})
export class LeaveGroupComponent {
  icon = faRightFromBracket
  constructor(private router: Router,
              private groupHub : GroupHubService,
              private group : GroupsService,
              private auth : UserService,
              private route : ActivatedRoute) {

  }

  leaveChat() {
    this.groupHub.leaveChat().then(() => {
      console.log("Disconnected")
    }).catch(e => {
      console.log(e)
    })

    this.auth.getUserID(this.auth.getUsername()).pipe(
      switchMap(userId => {
        const groupId = +this.route.snapshot.paramMap.get('id')!
        return this.group.getUserRole(userId, groupId).pipe(
          switchMap(role => this.group.deleteUserFromGroup(userId, groupId, role[0])),
          catchError(err => {
            console.error(err.message)
            return of({ message: 'An error occurred while deleting user from group.' })
          })
        )
      })
    ).subscribe({
      next: res => {
        console.log(res.message);
        this.router.navigate(['main/home'])
      },
      error: err => {
        console.error('An error occurred:', err)
      }
    })

  }
}
