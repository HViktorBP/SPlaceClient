import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LeaveGroupComponent } from './leave-group.component';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';
import { GroupsService } from '../../../../../../services/groups.service';
import { UsersService } from '../../../../../../services/users.service';
import { GroupDataService } from '../../../../../../services/states/group-data.service';
import { UserDataService } from '../../../../../../services/states/user-data.service';
import { ApplicationHubService } from '../../../../../../services/application-hub.service';
import { NgToastService } from "ng-angular-popup";
import { Router } from "@angular/router";
import { of } from 'rxjs';

class MockGroupsService {
  leaveGroup() {
    return of({ message: 'Successfully left the group' });
  }
}

class MockUsersService {
  getUserId() {
    return 1;
  }
  getUserAccount() {
    return of({
      groups: [],
      createdQuizzes: [],
      scores: [],
    });
  }
}

class MockGroupDataService {
  currentGroupId = 1;
}

class MockUserDataService {
  createdQuizzes = [
    { groupId: 1, id: 1, name: 'Sample Quiz' },
    { groupId: 2, id: 2, name: 'Another Quiz' }
  ];

  updateGroupData(groups: any) { }
  updateCreatedQuizzesData(quizzes: any) { }
  updateUserScores(scores: any) { }
}

class MockApplicationHubService {
  leaveGroup() {
    return Promise.resolve();
  }
  deleteQuiz() {
    return Promise.resolve();
  }
}

class MockNgToastService {
  info(message: any) { }
}

class MockRouter {
  navigate(url: string) {
    return Promise.resolve(true);
  }
}

describe('LeaveGroupComponent', () => {
  let component: LeaveGroupComponent;
  let fixture: ComponentFixture<LeaveGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LeaveGroupComponent,
        MatDialogModule,
        NoopAnimationsModule,
        MatButtonModule,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: GroupsService, useClass: MockGroupsService },
        { provide: UsersService, useClass: MockUsersService },
        { provide: GroupDataService, useClass: MockGroupDataService },
        { provide: UserDataService, useClass: MockUserDataService },
        { provide: ApplicationHubService, useClass: MockApplicationHubService },
        { provide: NgToastService, useClass: MockNgToastService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onSubmit() when the "Leave" button is clicked', fakeAsync(() => {
    spyOn(component, 'onSubmit').and.callThrough();

    const leaveButton = fixture.debugElement.query(By.css('button[type="submit"]'));
    leaveButton.nativeElement.click();
    tick();

    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('should close the dialog when the "Cancel" button is clicked', fakeAsync(() => {
    const cancelButton = fixture.debugElement.query(By.css('button[type="button"]'));
    cancelButton.nativeElement.click();
    tick();

    expect(component.dialogRef.close).toHaveBeenCalled();
  }));

  it('should call GroupsService.leaveGroup on form submit', fakeAsync(() => {
    const groupService = TestBed.inject(GroupsService);
    spyOn(groupService, 'leaveGroup').and.callThrough();

    component.onSubmit();
    tick();

    expect(groupService.leaveGroup).toHaveBeenCalled();
  }));

  it('should close the dialog after successfully leaving the group', fakeAsync(() => {
    component.onSubmit();
    tick();

    expect(component.dialogRef.close).toHaveBeenCalled();
  }));

  it('should navigate to "/main" after successfully leaving the group', fakeAsync(() => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.callThrough();

    component.onSubmit();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/main']);
  }));

  it('should call deleteQuiz for each quiz belonging to the group', fakeAsync(() => {
    const applicationHubService = TestBed.inject(ApplicationHubService);
    spyOn(applicationHubService, 'deleteQuiz').and.callThrough();

    component.onSubmit();
    tick();

    expect(applicationHubService.deleteQuiz).toHaveBeenCalledWith(1, 1);
  }));
});
