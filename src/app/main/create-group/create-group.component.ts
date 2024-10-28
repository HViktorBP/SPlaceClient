import {Component, inject} from '@angular/core';
import {GroupsService} from "../../services/groups.service";
import {UsersService} from "../../services/users.service";
import {CreateGroupRequest} from "../../data-transferring/contracts/group/create-group-request";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import {catchError, finalize, switchMap, take, tap, throwError} from "rxjs";
import {UsersDataService} from "../../states/users-data.service";
import {ApplicationHubService} from "../../services/application-hub.service";
import {MatButton} from "@angular/material/button";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatHint, MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {CustomPopUpForm} from "../../custom/interfaces/CustomPopUpForm";

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
  readonly dialogRef = inject(MatDialogRef<CreateGroupComponent>)
  newGroupForm!: FormGroup
  isLoading!: boolean

  constructor(private groupService : GroupsService,
              private toast : NgToastService,
              private applicationHubService : ApplicationHubService,
              private usersDataService : UsersDataService,
              private userService : UsersService,
              private fb : FormBuilder) { }

  ngOnInit() {
    this.newGroupForm = this.fb.group({
      groupName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
    })
  }

  onSubmit() {
    const userId = this.userService.getUserId()

    this.newGroupForm.disable()
    this.isLoading = true;

    const createGroupRequest: CreateGroupRequest = {
      userId: userId,
      groupName: this.newGroupForm.get("groupName")!.value
    }

    this.groupService.createGroup(createGroupRequest)
      .pipe(
        take(1),
        switchMap(() => this.userService.getUserAccount(userId).pipe(
          take(1),
          tap(account => {
            this.usersDataService.updateCreatedQuizzesData(account.createdQuizzes)
            this.usersDataService.updateCreatedGroupData(account.createdGroups)
            this.usersDataService.updateGroupData(account.groups)
          })
        )),
        catchError(error => {
          return throwError(() => error)
        }),
        finalize (() => {
          this.newGroupForm.enable()
          this.isLoading = false
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
