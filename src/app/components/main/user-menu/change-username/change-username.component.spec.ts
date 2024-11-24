import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { ChangeUsernameComponent } from './change-username.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UsersService } from "../../../../services/users.service";
import { NgToastService } from "ng-angular-popup";
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import {ApplicationHubService} from "../../../../services/application-hub.service";
import {UserDataService} from "../../../../services/states/user-data.service";

// Mock Services
class MockUsersService {
  changeUsername() {
    return of({ message: 'Username updated successfully', token: 'newToken' });
  }
  getUserId() {
    return 1;
  }
  getUserAccount(userId: number) {
    return of({ username: 'UpdatedUsername' });
  }
  storeUserData(token: string) {
    // Store token logic mock
  }
}

class MockNgToastService {
  success() {}
  error() {}
}

class MockApplicationHubService {
  changeName() {
    return Promise.resolve(); // Mock successful SignalR call
  }
}

describe('ChangeUsernameComponent', () => {
  let component: ChangeUsernameComponent;
  let fixture: ComponentFixture<ChangeUsernameComponent>;
  let toastService: NgToastService;
  let userService: UsersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ChangeUsernameComponent,
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
        UserDataService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeUsernameComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(NgToastService);
    userService = TestBed.inject(UsersService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.newUserNameForm).toBeDefined();
    expect(component.newUserNameForm.get('newUsername')?.value).toBe('');
  });

  it('should disable "Change" button when form is invalid', () => {
    const changeButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(changeButton.nativeElement.disabled).toBeTrue(); // Should be disabled initially
  });

  it('should enable "Change" button when form is valid', () => {
    component.newUserNameForm.get('newUsername')?.setValue('ValidUsername');
    fixture.detectChanges();

    const changeButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(changeButton.nativeElement.disabled).toBeFalse(); // Should be enabled when form is valid
  });

  it('should call changeUsername() on successful submission', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(userService, 'changeUsername').and.callThrough();
    spyOn(userService, 'storeUserData').and.callThrough();
    spyOn(toastService, 'success');

    // Set valid username and submit
    component.newUserNameForm.get('newUsername')?.setValue('ValidUsername');
    fixture.detectChanges();
    component.onSubmit();
    tick();

    expect(userService.changeUsername).toHaveBeenCalled();
    expect(toastService.success).toHaveBeenCalledWith(
      jasmine.objectContaining({ detail: 'Success', summary: 'Username updated successfully', duration: 3000 })
    );
    expect(userService.storeUserData).toHaveBeenCalledWith('newToken');
  }));
});
