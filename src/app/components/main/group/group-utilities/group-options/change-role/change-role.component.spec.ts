import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeRoleComponent } from './change-role.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { GroupsService } from '../../../../../../services/groups.service';
import { UsersService } from '../../../../../../services/users.service';
import { GroupDataService } from '../../../../../../services/states/group-data.service';
import { ApplicationHubService } from '../../../../../../services/application-hub.service';
import { NgToastService } from 'ng-angular-popup';
import { of } from 'rxjs';

class MockGroupsService {
  changeRole() {
    return of({ message: 'Role changed successfully' });
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
  changeRole() {
    return Promise.resolve();
  }
}

class MockNgToastService {
  success() {}
}

describe('ChangeRoleComponent', () => {
  let component: ChangeRoleComponent;
  let fixture: ComponentFixture<ChangeRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChangeRoleComponent,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
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

    fixture = TestBed.createComponent(ChangeRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.changeRoleForm).toBeDefined();
    expect(component.changeRoleForm.get('userName')?.value).toBe('');
    expect(component.changeRoleForm.get('userRole')?.value).toBe(3); // Default role is Participant
  });

  it('should show validation errors for invalid username', fakeAsync(() => {
    const userNameInput = component.changeRoleForm.get('userName');
    userNameInput?.setValue(''); // Set to empty to trigger validation
    userNameInput?.markAsTouched();
    fixture.detectChanges();
    tick();

    const errorMessages = fixture.debugElement.queryAll(By.css('mat-error'));
    expect(errorMessages.length).toBe(1);
    expect(errorMessages[0].nativeElement.textContent).toContain('User name must contain from 3 to 25 characters.');
  }));

  it('should enable the "Change" button only when the form is valid', fakeAsync(() => {
    const changeButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(changeButton.nativeElement.disabled).toBeTruthy(); // Should be disabled initially

    // Set valid form values
    component.changeRoleForm.get('userName')?.setValue('ValidUser');
    component.changeRoleForm.get('userRole')?.setValue(1);
    fixture.detectChanges();
    tick();

    expect(changeButton.nativeElement.disabled).toBeFalsy(); // Should now be enabled
  }));

  it('should call GroupsService.changeRole on form submit', fakeAsync(() => {
    const groupService = TestBed.inject(GroupsService);
    spyOn(groupService, 'changeRole').and.callThrough();

    // Set valid form values
    component.changeRoleForm.get('userName')?.setValue('ValidUser');
    component.changeRoleForm.get('userRole')?.setValue(1);

    // Submit the form
    component.onSubmit();
    tick();

    expect(groupService.changeRole).toHaveBeenCalled();
  }));

  it('should close the dialog after changing role successfully', fakeAsync(() => {
    // Set valid form values
    component.changeRoleForm.get('userName')?.setValue('ValidUser');
    component.changeRoleForm.get('userRole')?.setValue(1);

    // Submit the form
    component.onSubmit();
    tick();

    expect(component.dialogRef.close).toHaveBeenCalled();
  }));

  it('should show success toast after changing role successfully', fakeAsync(() => {
    const toastService = TestBed.inject(NgToastService);
    spyOn(toastService, 'success').and.callThrough();

    // Set valid form values
    component.changeRoleForm.get('userName')?.setValue('ValidUser');
    component.changeRoleForm.get('userRole')?.setValue(1);

    // Submit the form
    component.onSubmit();
    tick();

    expect(toastService.success).toHaveBeenCalledWith({
      detail: 'Success',
      summary: 'Role changed successfully',
      duration: 3000,
    });
  }));

  it('should reset the form on ngOnDestroy', () => {
    spyOn(component.changeRoleForm, 'reset').and.callThrough();
    component.ngOnDestroy();
    expect(component.changeRoleForm.reset).toHaveBeenCalled();
  });
});
