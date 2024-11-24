import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserMenuComponent } from './user-menu.component';
import { MatDialog } from '@angular/material/dialog';
import { UserDataService } from '../../../services/states/user-data.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';  // To prevent animations during testing
import { ChangeUsernameComponent } from './change-username/change-username.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeStatusComponent } from './change-status/change-status.component';
import { LogOutComponent } from './log-out/log-out.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { AboutAppComponent } from '../about-app/about-app.component';
import { MatDivider } from "@angular/material/divider";

// Mock MatDialog
class MockMatDialog {
  open = jasmine.createSpy('open');
}

// Mock UserDataService
class MockUserDataService {
  usernameAsync = of('TestUser');
  userStatusAsync = of('Online');
}

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;
  let dialog: MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenuComponent, MatMenuModule, NoopAnimationsModule, MatDivider], // Import necessary modules
      providers: [
        { provide: MatDialog, useClass: MockMatDialog },
        { provide: UserDataService, useClass: MockUserDataService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the username and status correctly', () => {
    fixture.detectChanges();

    const usernameElement = fixture.debugElement.query(By.css('h2')).nativeElement;
    const statusElement = fixture.debugElement.query(By.css('h3')).nativeElement;

    expect(usernameElement.textContent).toContain('TestUser');
    expect(statusElement.textContent).toContain('Status : Online');
  });

  it('should open ChangeUsernameComponent when "Change username" is clicked', () => {
    const menuTrigger = fixture.debugElement.query(By.directive(MatMenuTrigger));
    expect(menuTrigger).toBeTruthy(); // Ensure the trigger is present
    menuTrigger.triggerEventHandler('click', null); // Simulate click to open the menu
    fixture.detectChanges(); // Apply changes

    // Now query for the menu items
    const changeUsernameButton = fixture.debugElement.query(By.css('p:nth-child(1)'));
    expect(changeUsernameButton).toBeTruthy(); // Ensure the element is present

    changeUsernameButton.nativeElement.click();

    expect(dialog.open).toHaveBeenCalledWith(ChangeUsernameComponent);
  });

  it('should open ChangeEmailComponent when "Change email" is clicked', () => {
    // Trigger the menu to open
    const menuTrigger = fixture.debugElement.query(By.directive(MatMenuTrigger));
    expect(menuTrigger).toBeTruthy();
    menuTrigger.triggerEventHandler('click', null);
    fixture.detectChanges();

    const changeEmailButton = fixture.debugElement.query(By.css('p:nth-child(2)'));
    expect(changeEmailButton).toBeTruthy(); // Ensure the element is present

    changeEmailButton.nativeElement.click();

    expect(dialog.open).toHaveBeenCalledWith(ChangeEmailComponent);
  });

  it('should open ChangePasswordComponent when "Change password" is clicked', () => {
    // Trigger the menu to open
    const menuTrigger = fixture.debugElement.query(By.directive(MatMenuTrigger));
    expect(menuTrigger).toBeTruthy();
    menuTrigger.triggerEventHandler('click', null);
    fixture.detectChanges();

    const changePasswordButton = fixture.debugElement.query(By.css('p:nth-child(3)'));
    expect(changePasswordButton).toBeTruthy();

    changePasswordButton.nativeElement.click();

    expect(dialog.open).toHaveBeenCalledWith(ChangePasswordComponent);
  });

  it('should open ChangeStatusComponent when "Change status" is clicked', () => {
    // Trigger the menu to open
    const menuTrigger = fixture.debugElement.query(By.directive(MatMenuTrigger));
    expect(menuTrigger).toBeTruthy();
    menuTrigger.triggerEventHandler('click', null);
    fixture.detectChanges();

    const changeStatusButton = fixture.debugElement.query(By.css('p:nth-child(4)'));
    expect(changeStatusButton).toBeTruthy();

    changeStatusButton.nativeElement.click();

    expect(dialog.open).toHaveBeenCalledWith(ChangeStatusComponent);
  });

  it('should open LogOutComponent when "Log out" is clicked', () => {
    // Trigger the menu to open
    const menuTrigger = fixture.debugElement.query(By.directive(MatMenuTrigger));
    expect(menuTrigger).toBeTruthy();
    menuTrigger.triggerEventHandler('click', null);
    fixture.detectChanges();

    const logOutButton = fixture.debugElement.query(By.css('p:nth-child(5)'));
    expect(logOutButton).toBeTruthy();

    logOutButton.nativeElement.click();

    expect(dialog.open).toHaveBeenCalledWith(LogOutComponent);
  });

  it('should open AboutAppComponent when "About app" is clicked', () => {
    // Trigger the menu to open
    const menuTrigger = fixture.debugElement.query(By.directive(MatMenuTrigger));
    expect(menuTrigger).toBeTruthy();
    menuTrigger.triggerEventHandler('click', null);
    fixture.detectChanges();

    const aboutAppButton = fixture.debugElement.query(By.css('p:nth-child(7)')); // Skipping divider
    expect(aboutAppButton).toBeTruthy();

    aboutAppButton.nativeElement.click();

    expect(dialog.open).toHaveBeenCalledWith(AboutAppComponent);
  });

  it('should open DeleteAccountComponent when "Delete account" is clicked', () => {
    // Trigger the menu to open
    const menuTrigger = fixture.debugElement.query(By.directive(MatMenuTrigger));
    expect(menuTrigger).toBeTruthy();
    menuTrigger.triggerEventHandler('click', null);
    fixture.detectChanges();

    const deleteAccountButton = fixture.debugElement.query(By.css('p:nth-child(8)')); // Skipping divider
    expect(deleteAccountButton).toBeTruthy();

    deleteAccountButton.nativeElement.click();

    expect(dialog.open).toHaveBeenCalledWith(DeleteAccountComponent);
  });
});
