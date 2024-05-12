import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {UserService} from "../../../../../services/user.service";
import {UsersDataService} from "../../../../../services/users-data.service";
import {NgToastComponent, NgToastService} from "ng-angular-popup";

@Component({
  selector: 'app-change-status',
  standalone: true,
    imports: [
        FormsModule
    ],
  templateUrl: './change-status.component.html',
  styleUrl: '../../../../../../customStyles/options-custom.scss'
})
export class ChangeStatusComponent {
  constructor(private auth : UserService,
              private userService : UsersDataService,
              private toast : NgToastService) {

  }

  onChangeStatus(status: string){
    this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
      this.auth.changeStatus(status, userID).subscribe({
        next: res => {
          this.toast.success({detail:"Success", summary:res.message, duration:3000})
          this.userService.updateStatus(status)

        },
        error: err => {
          this.toast.error({detail:"Error", summary:err.error.message, duration:3000})
        }
      })
    })
  }
}
