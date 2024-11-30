import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RenameGroupComponent } from './rename-group.component';
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
  renameGroup() {
    return of({});
  }
}

class MockUsersService {
  getUserId() {
    return 1;
  }
  getUserAccount() {
    return of({ createdGroups: [] });
  }
}

class MockGroupDataService {
  currentGroupId = 1;
}

class MockApplicationHubService {
  renameGroup() {
    return Promise.resolve();
  }
}

class MockNgToastService {
  info(message: any) { }
}

describe('RenameGroupComponent', () => {
  let component: RenameGroupComponent;
  let fixture: ComponentFixture<RenameGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RenameGroupComponent,
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

    fixture = TestBed.createComponent(RenameGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct controls', () => {
    expect(component.renameGroupForm).toBeDefined();
    expect(component.renameGroupForm.get('groupName')).toBeDefined();
  });

  it('should disable the "Rename" button when the form is invalid', () => {
    const renameButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(renameButton.nativeElement.disabled).toBeTruthy();

    component.renameGroupForm.get('groupName')?.setValue('');
    fixture.detectChanges();
    expect(renameButton.nativeElement.disabled).toBeTruthy();

    component.renameGroupForm.get('groupName')?.setValue('Valid Group Name');
    fixture.detectChanges();
    expect(renameButton.nativeElement.disabled).toBeFalsy();
  });

  it('should close the dialog when the "Cancel" button is clicked', fakeAsync(() => {
    const cancelButton = fixture.debugElement.query(By.css('button[type="button"]'));
    cancelButton.nativeElement.click();
    tick();

    expect(component.dialogRef.close).toHaveBeenCalled();
  }));

  it('should call onSubmit() when the "Rename" button is clicked', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();

    component.renameGroupForm.get('groupName')?.setValue('Valid Group Name');
    fixture.detectChanges();

    const renameButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    renameButton.nativeElement.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should call GroupsService.renameGroup on form submit', fakeAsync(() => {
    const groupService = TestBed.inject(GroupsService);
    spyOn(groupService, 'renameGroup').and.callThrough();

    component.renameGroupForm.get('groupName')?.setValue('Valid Group Name');

    component.onSubmit();
    tick();

    expect(groupService.renameGroup).toHaveBeenCalled();
  }));

  it('should call ApplicationHubService.renameGroup after successful rename', fakeAsync(() => {
    const applicationHubService = TestBed.inject(ApplicationHubService);
    spyOn(applicationHubService, 'renameGroup').and.callThrough();

    component.renameGroupForm.get('groupName')?.setValue('Valid Group Name');

    component.onSubmit();
    tick();

    expect(applicationHubService.renameGroup).toHaveBeenCalledWith(1);
  }));

  it('should close the dialog after successful rename', fakeAsync(() => {
    component.renameGroupForm.get('groupName')?.setValue('Valid Group Name');

    component.onSubmit();
    tick();

    expect(component.dialogRef.close).toHaveBeenCalled();
  }));

  it('should display a success toast after successful rename', fakeAsync(() => {
    const toastService = TestBed.inject(NgToastService);
    spyOn(toastService, 'info');

    component.renameGroupForm.get('groupName')?.setValue('Valid Group Name');

    component.onSubmit();
    tick();

    expect(toastService.info).toHaveBeenCalledWith({ detail: "Info", summary: 'Group renamed successfully!', duration: 3000 });
  }));
});
