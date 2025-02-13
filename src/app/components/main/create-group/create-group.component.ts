import {Component, inject} from '@angular/core';
import {GroupsService} from "../../../services/groups.service";
import {UsersService} from "../../../services/users.service";
import {CreateGroupRequest} from "../../../data-transferring/contracts/group/create-group-request";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {catchError, finalize, switchMap, tap, throwError} from "rxjs";
import {UserDataService} from "../../../services/states/user-data.service";
import {ApplicationHubService} from "../../../services/application-hub.service";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatHint, MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {CustomPopUpForm} from "../../../custom/interfaces/CustomPopUpForm";

/**
 * CreateGroupComponent is responsible for creating a new group in application.
 */

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatLabel,
    MatHint,
    ReactiveFormsModule,
    MatError,
    NgIf
  ],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.scss'
})

export class CreateGroupComponent implements CustomPopUpForm {
  /**
   * Description: Reference to the component that will be opened in dialog
   */
  readonly dialogRef = inject(MatDialogRef<CreateGroupComponent>)

  /**
   * Description: Form for new group.
   */
  newGroupForm!: FormGroup

  constructor(private groupService : GroupsService,
              private toast : NgToastService,
              private applicationHubService : ApplicationHubService,
              private usersDataService : UserDataService,
              private userService : UsersService,
              private fb : FormBuilder) { }

  ngOnInit() {
    this.newGroupForm = this.fb.group({
      groupName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    })
  }

  /**
   * Description: onSubmit method calls a function that sends an HTTP request for creating a group and then handles the UI according to the request's response.
   * If the operation successful, it sets a new user-group connection in SignalR service by calling an applicationHub's setGroupConnection method.
   * @see ApplicationHubService
   */
  onSubmit() {
    const userId = this.userService.getUserId()

    this.newGroupForm.disable()

    const createGroupRequest: CreateGroupRequest = {
      userId: userId,
      groupName: this.newGroupForm.get("groupName")!.value
    }

    this.groupService.createGroup(createGroupRequest)
      .pipe(
        switchMap(() => this.userService.getUserAccount(userId).pipe(
          tap(account => {
            this.usersDataService.updateCreatedGroupData(account.createdGroups)
            this.usersDataService.updateGroupData(account.groups)
          })
        )),
        catchError(error => {
          return throwError(() => error)
        }),
        finalize (() => {
          this.newGroupForm.enable()
        })
      )
      .subscribe({
        next: user => {
          const newGroup = user.createdGroups.find(g => g.name === createGroupRequest.groupName)!

          this.applicationHubService.setGroupConnection(newGroup.id).then(() => {
            this.toast.success({ detail: "Success", summary: 'Group created.', duration: 3000 })
          })

          this.dialogRef.close()
        }
      })
  }

  ngOnDestroy() {
    this.newGroupForm.reset()
  }
}
