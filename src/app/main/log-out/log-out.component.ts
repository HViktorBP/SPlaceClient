import { Component } from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {PopUpService} from "../../services/pop-up.service";
import {faDoorOpen} from "@fortawesome/free-solid-svg-icons/faDoorOpen";
import {Router} from "@angular/router";

@Component({
  selector: 'app-log-out',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './log-out.component.html',
  styleUrl: './log-out.component.scss'
})
export class LogOutComponent {
  icon = faDoorOpen

  constructor(private userService : UserService,
              public popUpService : PopUpService,
              private router : Router) {
  }

  open(content: any) {
    this.popUpService.openModal(content).then(
      () => {
        this.onSubmit();
      },
      (reason) => {
        console.log(`Dismissed ${this.popUpService.getDismissReason(reason)}`);
      }
    );
  }

  onSubmit() {
    this.userService.logOut()
    this.router.navigate(['login']).then(
      () => this.popUpService.dismissThePopup()
    )
  }
}
