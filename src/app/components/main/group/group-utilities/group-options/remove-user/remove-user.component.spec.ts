import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RemoveUserComponent } from './remove-user.component';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { GroupsService } from '../../../../../../services/groups.service';
import { UsersService } from '../../../../../../services/users.service';
import { GroupDataService } from '../../../../../../services/states/group-data.service';
import { ApplicationHubService } from '../../../../../../services/application-hub.service';
import { NgToastService } from "ng-angular-popup";
import { ReactiveFormsModule } from "@angular/forms";
import { of } from 'rxjs';

class MockGroupsService {
  removeUser() {
    return of({ message: 'User removed successfully' });
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
  removeUser() {
    return Promise.resolve();
  }
}

class MockNgToastService {
  success(message: any) { }
}

describe('RemoveUserComponent', () => {
  let component: RemoveUserComponent;
  let fixture: ComponentFixture<RemoveUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RemoveUserComponent,
        MatDialogModule,
        NoopAnimationsModule,
        MatButtonModule,
        ReactiveFormsModule,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: GroupsService, useClass: MockGroupsService },
        { provide: UsersService, useClass: MockUsersService },
        { provide: GroupDataService, useClass: MockGroupDataService },
        { provide: ApplicationHubService, useClass: MockApplicationHubService },
        { provide: NgToastService, useClass: MockNgToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoveUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct controls', () => {
    expect(component.removeUserForm).toBeDefined();
    expect(component.removeUserForm.get('userName')).toBeDefined();
  });

  it('should disable the "Remove" button when the form is invalid', () => {
    const removeButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(removeButton.nativeElement.disabled).toBeTruthy();

    component.removeUserForm.get('userName')?.setValue('');
    fixture.detectChanges();
    expect(removeButton.nativeElement.disabled).toBeTruthy();

    component.removeUserForm.get('userName')?.setValue('Valid User');
    fixture.detectChanges();
    expect(removeButton.nativeElement.disabled).toBeFalsy();
  });

  it('should close the dialog when the "Cancel" button is clicked', fakeAsync(() => {
    const cancelButton = fixture.debugElement.query(By.css('button[type="button"]'));
    cancelButton.nativeElement.click();
    tick();

    expect(component.dialogRef.close).toHaveBeenCalled();
  }));

  it('should call onSubmit() when the "Remove" button is clicked', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();

    component.removeUserForm.get('userName')?.setValue('Valid User');
    fixture.detectChanges();

    const removeButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    removeButton.nativeElement.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should call GroupsService.removeUser on form submit', fakeAsync(() => {
    const groupService = TestBed.inject(GroupsService);
    spyOn(groupService, 'removeUser').and.callThrough();

    component.removeUserForm.get('userName')?.setValue('Valid User');

    component.onSubmit();
    tick();

    expect(groupService.removeUser).toHaveBeenCalled();
  }));

  it('should call ApplicationHubService.removeUser after successful remove', fakeAsync(() => {
    const applicationHubService = TestBed.inject(ApplicationHubService);
    spyOn(applicationHubService, 'removeUser').and.callThrough();

    component.removeUserForm.get('userName')?.setValue('Valid User');

    component.onSubmit();
    tick();

    expect(applicationHubService.removeUser).toHaveBeenCalledWith('Valid User', 1);
  }));

  it('should close the dialog after successful removal', fakeAsync(() => {
    component.removeUserForm.get('userName')?.setValue('Valid User');

    component.onSubmit();
    tick();

    expect(component.dialogRef.close).toHaveBeenCalled();
  }));

  it('should display a success toast after successful removal', fakeAsync(() => {
    const toastService = TestBed.inject(NgToastService);
    spyOn(toastService, 'success');

    component.removeUserForm.get('userName')?.setValue('Valid User');

    component.onSubmit();
    tick();

    expect(toastService.success).toHaveBeenCalledWith({ detail: "Info", summary: 'User removed successfully', duration: 3000 });
  }));
});
