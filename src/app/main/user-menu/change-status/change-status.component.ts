import {Component, inject} from '@angular/core';
import {UsersService} from "../../../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {ChangeStatusRequest} from "../../../contracts/user/change-status-request";
import {take} from "rxjs";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-change-status',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel
  ],
  templateUrl: './change-status.component.html',
  styleUrl: './change-status.component.scss'
})
export class ChangeStatusComponent {
  readonly dialogRef = inject(MatDialogRef<ChangeStatusComponent>);
  constructor(private toast : NgToastService,
              private userService : UsersService) { }

  onSubmit(form : NgForm) {
    const userId = this.userService.getUserId()

    const changeStatusRequest : ChangeStatusRequest = {
      userId : userId,
      newStatus : form.value.newStatus
    }

    this.userService.changeStatus(changeStatusRequest)
      .pipe(take(1))
      .subscribe({
        next : res => {
          this.toast.success({detail:"Info", summary: res.message, duration:3000})
          this.dialogRef.close()
        },
        error : err => {
          this.toast.error({detail:"Error", summary: err, duration:3000})
        }
      })
  }
}
