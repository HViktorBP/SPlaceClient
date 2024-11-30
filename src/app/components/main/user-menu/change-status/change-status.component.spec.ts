import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChangeStatusComponent } from './change-status.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UsersService } from "../../../../services/users.service";
import { NgToastService } from "ng-angular-popup";
import { ErrorHandler } from '@angular/core';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import {GlobalErrorHandlerService} from "../../../../services/error-handling/global-error-handler.service";
import {ApplicationHubService} from "../../../../services/application-hub.service";
import {UserDataService} from "../../../../services/states/user-data.service";

class MockUsersService {
  changeStatus() {
    return of({ message: 'Status updated successfully' });
  }
  getUserId() {
    return 1;
  }
  getUserAccount(userId: number) {
    return of({ status: 'New Status' });
  }
}

class MockNgToastService {
  success() {}
  error() {}
}

class MockApplicationHubService {
  changeStatus() {
    return Promise.resolve();
  }
}

describe('ChangeStatusComponent', () => {
  let component: ChangeStatusComponent;
  let fixture: ComponentFixture<ChangeStatusComponent>;
  let toastService: NgToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChangeStatusComponent,
        ReactiveFormsModule,
        MatDialogModule,
        NoopAnimationsModule,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: UsersService, useClass: MockUsersService },
        { provide: NgToastService, useClass: MockNgToastService },
        { provide: ApplicationHubService, useClass: MockApplicationHubService },
        { provide: ErrorHandler, useClass: GlobalErrorHandlerService },
        UserDataService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeStatusComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(NgToastService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.newStatusForm).toBeDefined();
    expect(component.newStatusForm.get('newStatus')?.value).toBe('');
  });

  it('should disable "Change" button when form is invalid', () => {
    const changeButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(changeButton.nativeElement.disabled).toBeTrue();
  });

  it('should enable "Change" button when form is valid', () => {
    component.newStatusForm.get('newStatus')?.setValue('New Status');
    fixture.detectChanges();

    const changeButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(changeButton.nativeElement.disabled).toBeFalse();
  });

  it('should call changeStatus() on successful submission', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    const userService = TestBed.inject(UsersService);
    spyOn(userService, 'changeStatus').and.callThrough();
    spyOn(toastService, 'success');

    component.newStatusForm.get('newStatus')?.setValue('New Status');
    fixture.detectChanges();
    component.onSubmit();
    tick();

    expect(userService.changeStatus).toHaveBeenCalled();
    expect(toastService.success).toHaveBeenCalledWith(
      jasmine.objectContaining({ detail: 'Success', summary: 'Status updated', duration: 3000 })
    );
  }));
});
