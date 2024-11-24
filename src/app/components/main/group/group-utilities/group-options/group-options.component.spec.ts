import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { GroupOptionsComponent } from './group-options.component';
import { Role } from '../../../../../data-transferring/enums/role';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {RenameGroupComponent} from "./rename-group/rename-group.component";
import {DeleteGroupComponent} from "./delete-group/delete-group.component";
import {LeaveGroupComponent} from "./leave-group/leave-group.component";
import {RemoveUserComponent} from "./remove-user/remove-user.component";
import {AddUserComponent} from "./add-user/add-user.component";

describe('GroupOptionsComponent', () => {
  let component: GroupOptionsComponent;
  let fixture: ComponentFixture<GroupOptionsComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatIconModule,
        MatDialogModule,
        MatButtonModule,
        NoopAnimationsModule,
        GroupOptionsComponent
      ],
      providers: [
        { provide: MatDialog, useValue: mockDialog }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render add and remove user buttons for Administrator', () => {
    component.role = Role.Administrator;
    fixture.detectChanges();

    const addUserButton = fixture.debugElement.query(By.css('button[title="Add user"]'));
    const removeUserButton = fixture.debugElement.query(By.css('button[title="Remove user"]'));

    expect(addUserButton).toBeTruthy();
    expect(removeUserButton).toBeTruthy();
  });

  it('should not render rename or delete group buttons for Administrator', () => {
    component.role = Role.Administrator;
    fixture.detectChanges();

    const renameGroupButton = fixture.debugElement.query(By.css('button[title="Rename group"]'));
    const deleteGroupButton = fixture.debugElement.query(By.css('button[title="Delete group"]'));

    expect(renameGroupButton).toBeNull();
    expect(deleteGroupButton).toBeNull();
  });

  it('should render all options for Creator', () => {
    component.role = Role.Creator;
    fixture.detectChanges();

    const addUserButton = fixture.debugElement.query(By.css('button[title="Add user"]'));
    const removeUserButton = fixture.debugElement.query(By.css('button[title="Remove user"]'));
    const changeRoleButton = fixture.debugElement.query(By.css('button[title="Change role"]'));
    const renameGroupButton = fixture.debugElement.query(By.css('button[title="Rename group"]'));
    const deleteGroupButton = fixture.debugElement.query(By.css('button[title="Delete group"]'));

    expect(addUserButton).toBeTruthy();
    expect(removeUserButton).toBeTruthy();
    expect(changeRoleButton).toBeTruthy();
    expect(renameGroupButton).toBeTruthy();
    expect(deleteGroupButton).toBeTruthy();
  });

  it('should render "Leave group" button for non-Creators', () => {
    component.role = Role.Moderator;
    fixture.detectChanges();

    const leaveGroupButton = fixture.debugElement.query(By.css('button[title="Leave group"]'));
    expect(leaveGroupButton).toBeTruthy();
  });

  it('should open the AddUserComponent when clicking "Add user" button', () => {
    component.role = Role.Administrator;
    fixture.detectChanges();

    const addUserButton = fixture.debugElement.query(By.css('button[title="Add user"]'));
    addUserButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(mockDialog.open).toHaveBeenCalledWith(AddUserComponent);
  });

  it('should open the RemoveUserComponent when clicking "Remove user" button', () => {
    component.role = Role.Moderator;
    fixture.detectChanges();

    const removeUserButton = fixture.debugElement.query(By.css('button[title="Remove user"]'));
    removeUserButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(mockDialog.open).toHaveBeenCalledWith(RemoveUserComponent);
  });

  it('should open the RenameGroupComponent when clicking "Rename group" button', () => {
    component.role = Role.Creator;
    fixture.detectChanges();

    const renameGroupButton = fixture.debugElement.query(By.css('button[title="Rename group"]'));
    renameGroupButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(mockDialog.open).toHaveBeenCalledWith(RenameGroupComponent);
  });

  it('should open the DeleteGroupComponent when clicking "Delete group" button', () => {
    component.role = Role.Creator;
    fixture.detectChanges();

    const deleteGroupButton = fixture.debugElement.query(By.css('button[title="Delete group"]'));
    deleteGroupButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(mockDialog.open).toHaveBeenCalledWith(DeleteGroupComponent);
  });

  it('should open the LeaveGroupComponent when clicking "Leave group" button', () => {
    component.role = Role.Administrator;
    fixture.detectChanges();

    const leaveGroupButton = fixture.debugElement.query(By.css('button[title="Leave group"]'));
    leaveGroupButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(mockDialog.open).toHaveBeenCalledWith(LeaveGroupComponent);
  });
});
