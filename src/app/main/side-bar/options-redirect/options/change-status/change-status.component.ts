import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {UserService} from "../../../../../services/user.service";
import {UsersDataService} from "../../../../../services/users-data.service";

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
  constructor(private auth : UserService, private userService : UsersDataService) {

  }

  onChangeStatus(status: string){
    this.auth.getUserID(this.auth.getUsername()).subscribe(userID => {
      this.auth.changeStatus(status, userID).subscribe({
        next: res => {
          console.log(res.message)
          this.userService.updateStatus(status)
        },
        error: err=> {
          console.log(err.error.message)
        }
      })
    })
  }
}
