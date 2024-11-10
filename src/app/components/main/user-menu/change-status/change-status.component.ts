import {Component, inject} from '@angular/core';
import {UsersService} from "../../../../services/users.service";
import {NgToastService} from "ng-angular-popup";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ChangeStatusRequest} from "../../../../data-transferring/contracts/user/change-status-request";
import {catchError, finalize, switchMap, take, tap, throwError} from "rxjs";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {UsersDataService} from "../../../../services/states/users-data.service";
import {NgIf} from "@angular/common";
import {CustomPopUpForm} from "../../../../custom/interfaces/CustomPopUpForm";
import {ApplicationHubService} from "../../../../services/application-hub.service";

/**
 * ChangeStatusComponent provides UI for user to change the status.
 */

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
    MatLabel,
    MatError,
    NgIf
  ],
  templateUrl: './change-status.component.html',
  styleUrl: './change-status.component.scss'
})
export class ChangeStatusComponent implements CustomPopUpForm {
  /**
   * Description: Reference to the component that will be opened in dialog.
   */
  readonly dialogRef = inject(MatDialogRef<ChangeStatusComponent>)

  /**
   * Description: form for new status.
   */
  newStatusForm!: FormGroup

  constructor(private toast : NgToastService,
              private userService : UsersService,
              private userDataService : UsersDataService,
              private applicationHub : ApplicationHubService,
              private fb : FormBuilder) { }

  ngOnInit() {
    this.newStatusForm = this.fb.group({
      newStatus: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
    })
  }

  /**
   * Description: onSubmit method calls a function that sends an HTTP request for changing a user's status and handles the UI according to the request's response.
   * If the operation successful, the status changing is also broadcast to the groups where user participates by calling an applicationHub's changeStatus method.
   * @see ApplicationHubService
   */
  onSubmit() {
    const userId = this.userService.getUserId()

    this.newStatusForm.disable()

    const changeStatusRequest : ChangeStatusRequest = {
      userId : userId,
      newStatus : this.newStatusForm.get('newStatus')!.value
    }

    this.userService.changeStatus(changeStatusRequest)
      .pipe(
        take(1),
        switchMap(() => {
          return this.userService.getUserAccount(this.userService.getUserId())
        }),
        tap(userAccount => {
          this.userDataService.updateStatus(userAccount.status)
        }),
        catchError(error => {
          return throwError(() => error)
        }),
        finalize (() => {
          this.newStatusForm.enable()
        })
      )
      .subscribe({
        next : () => {
          this.applicationHub.changeStatus().then(
            () => {
              this.toast.success({detail:"Success", summary: 'Status updated', duration:3000})
              this.dialogRef.close()
            }
          )
        }
      })
  }

  ngOnDestroy() {
    this.newStatusForm.reset()
  }
}
