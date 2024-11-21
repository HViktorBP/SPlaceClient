import { ComponentFixture, TestBed, } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateGroupComponent } from './create-group.component';
import { GroupsService } from '../../../services/groups.service';
import { UsersService } from '../../../services/users.service';
import { UserDataService } from '../../../services/states/user-data.service';
import { ApplicationHubService } from '../../../services/application-hub.service';
import { NgToastService } from 'ng-angular-popup';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, } from 'rxjs';

// Mock services
class MockGroupsService {
  createGroup() {
    return of({});
  }
}

class MockUsersService {
  getUserId() {
    return 123;
  }

  getUserAccount(userId: string) {
    return of({
      createdGroups: [{ id: 1, name: 'Test Group' }],
      groups: [{ id: 1, name: 'Test Group' }],
    });
  }
}

class MockUserDataService {
  updateCreatedGroupData() {}
  updateGroupData() {}
}

class MockApplicationHubService {
  setGroupConnection(groupId: string) {
    return Promise.resolve();
  }
}

class MockNgToastService {
  success() {}
  error() {}
}

class MockMatDialogRef {
  close() {}
}

describe('CreateGroupComponent', () => {
  let component: CreateGroupComponent;
  let fixture: ComponentFixture<CreateGroupComponent>;
  let groupsService: GroupsService;
  let usersService: UsersService;
  let toastService: NgToastService;
  let dialogRef: MatDialogRef<CreateGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CreateGroupComponent, BrowserAnimationsModule],
      providers: [
        FormBuilder,
        { provide: GroupsService, useClass: MockGroupsService },
        { provide: UsersService, useClass: MockUsersService },
        { provide: UserDataService, useClass: MockUserDataService },
        { provide: ApplicationHubService, useClass: MockApplicationHubService },
        { provide: NgToastService, useClass: MockNgToastService },
        { provide: MatDialogRef, useClass: MockMatDialogRef },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGroupComponent);
    component = fixture.componentInstance;
    groupsService = TestBed.inject(GroupsService);
    usersService = TestBed.inject(UsersService);
    toastService = TestBed.inject(NgToastService);
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.newGroupForm).toBeDefined();
    expect(component.newGroupForm.get('groupName')).toBeDefined();
    expect(component.newGroupForm.get('groupName')?.value).toBe('');
  });

  it('should reset the form on ngOnDestroy', () => {
    const resetSpy = spyOn(component.newGroupForm, 'reset');
    component.ngOnDestroy();
    expect(resetSpy).toHaveBeenCalled();
  });
});
