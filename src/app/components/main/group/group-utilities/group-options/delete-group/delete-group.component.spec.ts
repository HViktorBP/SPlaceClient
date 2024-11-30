import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DeleteGroupComponent } from './delete-group.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { GroupsService } from '../../../../../../services/groups.service';
import { UsersService } from '../../../../../../services/users.service';
import { GroupDataService } from '../../../../../../services/states/group-data.service';
import { UserDataService } from '../../../../../../services/states/user-data.service';
import { ApplicationHubService } from '../../../../../../services/application-hub.service';
import { of } from 'rxjs';

class MockGroupsService {
  deleteGroup() {
    return of({ message: 'Group deleted successfully' });
  }
}

class MockUsersService {
  getUserId() {
    return 1;
  }
  getUserAccount() {
    return of({
      createdQuizzes: [],
      createdGroups: [],
    });
  }
}

class MockGroupDataService {
  currentGroupId = 1;
}

class MockUserDataService {
  updateCreatedQuizzesData() {}
  updateCreatedGroupData() {}
}

class MockApplicationHubService {
  deleteGroup() {
    return Promise.resolve();
  }
}

describe('DeleteGroupComponent', () => {
  let component: DeleteGroupComponent;
  let fixture: ComponentFixture<DeleteGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DeleteGroupComponent,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        NoopAnimationsModule,
        MatButtonModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: GroupsService, useClass: MockGroupsService },
        { provide: UsersService, useClass: MockUsersService },
        { provide: GroupDataService, useClass: MockGroupDataService },
        { provide: UserDataService, useClass: MockUserDataService },
        { provide: ApplicationHubService, useClass: MockApplicationHubService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSubmit() when the "Delete" button is clicked', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();

    const deleteButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    deleteButton.nativeElement.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should close the dialog on cancel button click', fakeAsync(() => {
    const cancelButton = fixture.debugElement.query(By.css('button[type="button"]'));
    cancelButton.nativeElement.click();
    tick();

    expect(component.dialogRef.close).toHaveBeenCalled();
  }));

  it('should call GroupsService.deleteGroup on form submit', fakeAsync(() => {
    const groupService = TestBed.inject(GroupsService);
    spyOn(groupService, 'deleteGroup').and.callThrough();

    component.onSubmit();
    tick();

    expect(groupService.deleteGroup).toHaveBeenCalled();
  }));

  it('should update user data on successful group deletion', fakeAsync(() => {
    const userDataService = TestBed.inject(UserDataService);
    spyOn(userDataService, 'updateCreatedQuizzesData').and.callThrough();
    spyOn(userDataService, 'updateCreatedGroupData').and.callThrough();

    component.onSubmit();
    tick();

    expect(userDataService.updateCreatedQuizzesData).toHaveBeenCalled();
    expect(userDataService.updateCreatedGroupData).toHaveBeenCalled();
  }));

  it('should close the dialog after deleting the group', fakeAsync(() => {
    component.onSubmit();
    tick();

    expect(component.dialogRef.close).toHaveBeenCalled();
  }));
});
