import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LogOutComponent } from './log-out.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsersService } from "../../../../services/users.service";
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Mock Services
class MockUsersService {
  logOut() {
    // Dummy log out implementation for testing
  }
}

class MockRouter {
  navigate() {
    return Promise.resolve(true); // Mock navigation success
  }
}

describe('LogOutComponent', () => {
  let component: LogOutComponent;
  let fixture: ComponentFixture<LogOutComponent>;
  let userService: UsersService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LogOutComponent,
        MatDialogModule,
        NoopAnimationsModule, // To disable animations during testing
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: UsersService, useClass: MockUsersService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LogOutComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UsersService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call logOut on UsersService and navigate to login when submitting', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();
    spyOn(userService, 'logOut').and.callThrough();
    spyOn(router, 'navigate').and.callThrough();

    // Trigger form submission
    component.onSubmit();
    tick(); // Simulate async operations

    expect(component.onSubmit).toHaveBeenCalled();
    expect(userService.logOut).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.dialogRef.close).toHaveBeenCalled(); // Verify dialog is closed after logging out
  }));

  it('should close the dialog when "Not yet" button is clicked', fakeAsync(() => {
    // Find the "Not yet" button and trigger a click event
    const notYetButton = fixture.debugElement.query(By.css('button[type="button"]'));
    notYetButton.nativeElement.click();
    fixture.detectChanges();

    expect(component.dialogRef.close).toHaveBeenCalled();
  }));
});
