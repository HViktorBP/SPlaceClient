import {Component, inject} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";
import {GroupComponent} from "../../../group.component";
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

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
  groupData = inject(GroupComponent)
  icon = faRightFromBracket
  constructor(private router: Router) {

  }

  leaveChat() {
    this.groupData.leaveChat().then(() => {
      this.router.navigate(['main/home'])
    }).catch(e => {
      console.log(e)
    })
  }
}
