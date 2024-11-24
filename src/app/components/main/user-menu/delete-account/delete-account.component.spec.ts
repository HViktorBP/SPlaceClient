import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DeleteAccountComponent } from './delete-account.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UsersService } from "../../../../services/users.service";
import { NgToastService } from "ng-angular-popup";
import { UserDataService } from '../../../../services/states/user-data.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import {ApplicationHubService} from "../../../../services/application-hub.service";

// Mock Services
class MockUsersService {
  deleteAccount() {
    return of({ message: 'Account deleted successfully' });
  }
  logOut() {

  }
}

class MockNgToastService {
  info() {}
  error() {}
}

class MockApplicationHubService {
  deleteUser() {
    return Promise.resolve();
  }
}

class MockRouter {
  navigate() {
    return Promise.resolve(true);
  }
}

describe('DeleteAccountComponent', () => {
  let component: DeleteAccountComponent;
  let fixture: ComponentFixture<DeleteAccountComponent>;
  let toastService: NgToastService;
  let userService: UsersService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DeleteAccountComponent,
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
        { provide: UserDataService, useValue: { createdGroups: [{ id: 1 }, { id: 2 }] } },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteAccountComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(NgToastService);
    userService = TestBed.inject(UsersService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading set to false', () => {
    expect(component.isLoading).toBeFalse();
  });

  it('should disable buttons while loading', fakeAsync(() => {
    component.isLoading = true;
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    const cancelButton = fixture.debugElement.query(By.css('button[type="button"]'));

    expect(deleteButton.nativeElement.disabled).toBeTrue();
    expect(cancelButton.nativeElement.disabled).toBeTrue();
  }));

  it('should enable buttons when not loading', fakeAsync(() => {
    component.isLoading = false;
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    const cancelButton = fixture.debugElement.query(By.css('button[type="button"]'));

    expect(deleteButton.nativeElement.disabled).toBeFalse();
    expect(cancelButton.nativeElement.disabled).toBeFalse();
  }));

  it('should call deleteAccount() and handle success', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(userService, 'deleteAccount').and.callThrough();
    spyOn(userService, 'logOut').and.callThrough();
    spyOn(toastService, 'info');
    spyOn(router, 'navigate').and.callThrough();

    // Trigger form submission
    component.onSubmit();
    tick(); // Simulate async operations

    expect(component.onSubmit).toHaveBeenCalled();
    expect(userService.deleteAccount).toHaveBeenCalled();
    expect(toastService.info).toHaveBeenCalledWith(
      jasmine.objectContaining({ detail: 'Info', summary: 'Account deleted successfully', duration: 3000 })
    );
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(userService.logOut).toHaveBeenCalled();
  }));
});
