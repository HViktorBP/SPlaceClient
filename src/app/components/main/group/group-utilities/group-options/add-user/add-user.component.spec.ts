import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AddUserComponent } from './add-user.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { GroupsService } from '../../../../../../services/groups.service';
import { UsersService } from '../../../../../../services/users.service';
import { GroupDataService } from '../../../../../../services/states/group-data.service';
import { NgToastService } from 'ng-angular-popup';
import { ApplicationHubService } from '../../../../../../services/application-hub.service';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockGroupsService {
  addUser() {
    return of({ message: 'User added successfully' });
  }
}

class MockUsersService {
  getUserId() {
    return 1;
  }
}

class MockGroupDataService {
  currentGroupId = 1;
}

class MockApplicationHubService {
  addToGroup() {
    return Promise.resolve();
  }
}

class MockNgToastService {
  success() {}
}

describe('AddUserComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddUserComponent,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: GroupsService, useClass: MockGroupsService },
        { provide: UsersService, useClass: MockUsersService },
        { provide: GroupDataService, useClass: MockGroupDataService },
        { provide: ApplicationHubService, useClass: MockApplicationHubService },
        { provide: NgToastService, useClass: MockNgToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.addUserForm).toBeDefined();
    expect(component.addUserForm.get('userName')?.value).toBe('');
    expect(component.addUserForm.get('userRole')?.value).toBe(3);
  });

  it('should show validation errors for invalid username', fakeAsync(() => {
    const userNameInput = component.addUserForm.get('userName');
    userNameInput?.setValue('');
    userNameInput?.markAsTouched();
    fixture.detectChanges();
    tick();

    const errorMessages = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(errorMessages.length).toBe(1);
    expect(errorMessages[0].nativeElement.textContent).toContain('User name must contain from 3 to 25 characters.');
  }));

  it('should enable the "Add" button only when the form is valid', fakeAsync(() => {
    const addButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(addButton.nativeElement.disabled).toBeTruthy();

    component.addUserForm.get('userName')?.setValue('ValidUser');
    component.addUserForm.get('userRole')?.setValue(1);
    fixture.detectChanges();
    tick();

    expect(addButton.nativeElement.disabled).toBeFalsy();
  }));

  it('should call GroupsService.addUser on form submit', fakeAsync(() => {
    const groupService = TestBed.inject(GroupsService);
    spyOn(groupService, 'addUser').and.callThrough();

    component.addUserForm.get('userName')?.setValue('ValidUser');
    component.addUserForm.get('userRole')?.setValue(1);

    component.onSubmit();
    tick();

    expect(groupService.addUser).toHaveBeenCalled();
  }));

  it('should close the dialog after adding user successfully', fakeAsync(() => {
    component.addUserForm.get('userName')?.setValue('ValidUser');
    component.addUserForm.get('userRole')?.setValue(1);

    component.onSubmit();
    tick();

    expect(component.dialogRef.close).toHaveBeenCalled();
  }));

  it('should show success toast after adding user successfully', fakeAsync(() => {
    const toastService = TestBed.inject(NgToastService);
    spyOn(toastService, 'success').and.callThrough();

    component.addUserForm.get('userName')?.setValue('ValidUser');
    component.addUserForm.get('userRole')?.setValue(1);

    component.onSubmit();
    tick();

    expect(toastService.success).toHaveBeenCalledWith({
      detail: 'Success',
      summary: 'User added successfully',
      duration: 3000,
    });
  }));

  it('should reset the form on ngOnDestroy', () => {
    spyOn(component.addUserForm, 'reset').and.callThrough();
    component.ngOnDestroy();
    expect(component.addUserForm.reset).toHaveBeenCalled();
  });
});
