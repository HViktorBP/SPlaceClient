import {Component, inject} from '@angular/core';
import {UsersService} from "../../../../../../services/users.service";
import {GroupsService} from "../../../../../../services/groups.service";
import {NgToastService} from "ng-angular-popup";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RenameGroupRequest} from "../../../../../../data-transferring/contracts/group/rename-group-request";
import {GroupDataService} from "../../../../../../services/states/group-data.service";
import {catchError, finalize, take, throwError} from "rxjs";
import {ApplicationHubService} from "../../../../../../services/application-hub.service";
import {MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {CustomPopUpForm} from "../../../../../../custom/interfaces/CustomPopUpForm";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-rename-group',
  standalone: true,
  imports: [
    FaIconComponent,
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
  templateUrl: './rename-group.component.html',
  styleUrl: './rename-group.component.scss'
})

export class RenameGroupComponent implements CustomPopUpForm{
  readonly dialogRef = inject(MatDialogRef<RenameGroupComponent>)
  isLoading!: boolean
  renameGroupForm!: FormGroup

  constructor(private userService : UsersService,
              private groupService : GroupsService,
              private applicationHubService : ApplicationHubService,
              private toast : NgToastService,
              private groupDataService : GroupDataService,
              private fb : FormBuilder) { }

  ngOnInit(): void {
    this.renameGroupForm = this.fb.group({
      groupName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]]
    })
  }

  onSubmit() {
    const groupId : number = this.groupDataService.currentGroupId
    const userId : number = this.userService.getUserId()

    this.renameGroupForm.disable()
    this.isLoading = true

    const renameGroupRequest : RenameGroupRequest = {
      userId : userId,
      groupId : groupId,
      newGroupName : this.renameGroupForm.get('groupName')!.value
    }

    this.groupService.renameGroup(renameGroupRequest)
      .pipe(
        take(1),
        catchError(error => {
          return throwError(() => error)
        }),
        finalize(() => {
          this.renameGroupForm.enable()
          this.isLoading = false
        })
      )
      .subscribe({
        next : res => {
          this.applicationHubService.renameGroup(renameGroupRequest.groupId)
            .then(
              () => {
                this.toast.info({detail:"Info", summary: res.message, duration:3000})
                this.dialogRef.close()
              }
            )
        }
      })
  }

  ngOnDestroy(): void {
    this.renameGroupForm.reset()
  }
}
