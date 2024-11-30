import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import { ChangePasswordComponent } from './change-password.component';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UsersService } from '../../../../services/users.service';
import { NgToastService } from "ng-angular-popup";
import { of } from 'rxjs';
import {GlobalErrorHandlerService} from "../../../../services/error-handling/global-error-handler.service";
import {ErrorHandler} from "@angular/core";

class MockUsersService {
  getUserId() {
    return 1;
  }
  changePassword(changePasswordRequest: any) {
    return of({ message: 'Password changed successfully!' });
  }
}

class MockNgToastService {
  success(message: any) { }
  error(message: any) { }
}

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChangePasswordComponent,
        ReactiveFormsModule,
        MatDialogModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: UsersService, useClass: MockUsersService },
        { provide: NgToastService, useClass: MockNgToastService },
        { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.newPasswordForm).toBeDefined();
    expect(component.newPasswordForm.get('newPassword')).toBeDefined();
    expect(component.newPasswordForm.get('submitNewPassword')).toBeDefined();
  });

  it('should disable the "Change" button when the form is invalid', () => {
    const changeButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(changeButton.nativeElement.disabled).toBeTruthy();

    component.newPasswordForm.get('newPassword')?.setValue('');
    component.newPasswordForm.get('submitNewPassword')?.setValue('');
    fixture.detectChanges();
    expect(changeButton.nativeElement.disabled).toBeTruthy();

    component.newPasswordForm.get('newPassword')?.setValue('validpassword123');
    component.newPasswordForm.get('submitNewPassword')?.setValue('validpassword123');
    fixture.detectChanges();
    expect(changeButton.nativeElement.disabled).toBeFalsy();
  });

  it('should close the dialog when the "Cancel" button is clicked', fakeAsync(() => {
    const cancelButton = fixture.debugElement.query(By.css('button[type="button"]'));
    cancelButton.nativeElement.click();
    tick();

    expect(component.dialogRef.close).toHaveBeenCalled();
  }));

  it('should show an error toast if passwords do not match', () => {
    const toastService = TestBed.inject(NgToastService);
    spyOn(toastService, 'error');

    component.newPasswordForm.get('newPassword')?.setValue('password123');
    component.newPasswordForm.get('submitNewPassword')?.setValue('password456');
    fixture.detectChanges();

    component.onSubmit();

    expect(toastService.error).toHaveBeenCalledWith({ detail: "Info", summary: "Passwords doesn't match.", duration: 3000 });
  });

  it('should call onSubmit() when the "Change" button is clicked', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();

    component.newPasswordForm.get('newPassword')?.setValue('password123');
    component.newPasswordForm.get('submitNewPassword')?.setValue('password123');
    fixture.detectChanges();

    const changeButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    changeButton.nativeElement.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should call UsersService.changePassword on form submit', fakeAsync(() => {
    const userService = TestBed.inject(UsersService);
    spyOn(userService, 'changePassword').and.callThrough();

    component.newPasswordForm.get('newPassword')?.setValue('password123');
    component.newPasswordForm.get('submitNewPassword')?.setValue('password123');

    component.onSubmit();
    tick();

    expect(userService.changePassword).toHaveBeenCalled();
  }));

  it('should display a success toast after successful password change', fakeAsync(() => {
    const toastService = TestBed.inject(NgToastService);
    spyOn(toastService, 'success');

    component.newPasswordForm.get('newPassword')?.setValue('password123');
    component.newPasswordForm.get('submitNewPassword')?.setValue('password123');

    component.onSubmit();
    tick();

    expect(toastService.success).toHaveBeenCalledWith({ detail: "Success", summary: 'Password changed successfully!', duration: 3000 });
  }));

  it('should close the dialog after successful password change', fakeAsync(() => {
    component.newPasswordForm.get('newPassword')?.setValue('password123');
    component.newPasswordForm.get('submitNewPassword')?.setValue('password123');

    component.onSubmit();
    tick();

    expect(component.dialogRef.close).toHaveBeenCalled();
  }));
});
