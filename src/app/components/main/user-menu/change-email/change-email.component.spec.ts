import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeEmailComponent } from './change-email.component';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../../../services/users.service';
import { NgToastService } from "ng-angular-popup";
import { of } from 'rxjs';

class MockUsersService {
  getUserId() {
    return 1;
  }
  changeEmail() {
    return of({ message: 'Email changed successfully!' });
  }
}

class MockNgToastService {
  success(message: any) { }
}

describe('ChangeEmailComponent', () => {
  let component: ChangeEmailComponent;
  let fixture: ComponentFixture<ChangeEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChangeEmailComponent,
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
        { provide: UsersService, useClass: MockUsersService },
        { provide: NgToastService, useClass: MockNgToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.newEmailForm).toBeDefined();
    expect(component.newEmailForm.get('newEmail')).toBeDefined();
  });

  it('should disable the "Change" button when the form is invalid', () => {
    const changeButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(changeButton.nativeElement.disabled).toBeTruthy();

    component.newEmailForm.get('newEmail')?.setValue('');
    fixture.detectChanges();
    expect(changeButton.nativeElement.disabled).toBeTruthy();

    component.newEmailForm.get('newEmail')?.setValue('test@example.com');
    fixture.detectChanges();
    expect(changeButton.nativeElement.disabled).toBeFalsy();
  });

  it('should close the dialog when the "Cancel" button is clicked', fakeAsync(() => {
    const cancelButton = fixture.debugElement.query(By.css('button[type="button"]'));
    cancelButton.nativeElement.click();
    tick();

    expect(component.dialogRef.close).toHaveBeenCalled();
  }));

  it('should call onSubmit() when the "Change" button is clicked', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();

    component.newEmailForm.get('newEmail')?.setValue('test@example.com');
    fixture.detectChanges();

    const changeButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    changeButton.nativeElement.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should call UsersService.changeEmail on form submit', fakeAsync(() => {
    const userService = TestBed.inject(UsersService);
    spyOn(userService, 'changeEmail').and.callThrough();

    component.newEmailForm.get('newEmail')?.setValue('test@example.com');

    component.onSubmit();
    tick();

    expect(userService.changeEmail).toHaveBeenCalled();
  }));

  it('should display a success toast after successful email change', fakeAsync(() => {
    const toastService = TestBed.inject(NgToastService);
    spyOn(toastService, 'success');

    component.newEmailForm.get('newEmail')?.setValue('test@example.com');

    component.onSubmit();
    tick();

    expect(toastService.success).toHaveBeenCalledWith({ detail: "Success", summary: 'Email changed successfully!', duration: 3000 });
  }));

  it('should close the dialog after successful email change', fakeAsync(() => {
    component.newEmailForm.get('newEmail')?.setValue('test@example.com');

    component.onSubmit();
    tick();

    expect(component.dialogRef.close).toHaveBeenCalled();
  }));
});
