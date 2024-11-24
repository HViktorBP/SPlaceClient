import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DeleteQuizComponent } from './delete-quiz.component';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { QuizzesService } from '../../../../../../services/quizzes.service';
import { UsersService } from '../../../../../../services/users.service';
import { ApplicationHubService } from '../../../../../../services/application-hub.service';
import { UserDataService } from '../../../../../../services/states/user-data.service';
import { GroupDataService } from '../../../../../../services/states/group-data.service';
import { NgToastService } from 'ng-angular-popup';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

// Mock Services
class MockQuizzesService {
  deleteQuiz() {
    return of(null); // Mocked response for delete quiz
  }
}

class MockUsersService {
  getUserId() {
    return 1; // Mocked user ID
  }

  getUserAccount() {
    return of({ createdQuizzes: [] }); // Mocked user account response
  }
}

class MockApplicationHubService {
  deleteQuiz(groupId: number, quizId: number) {
    return Promise.resolve(); // Mock the deleteQuiz method
  }
}

class MockUserDataService {
  updateCreatedQuizzesData(data: any) {
    // Mock updateCreatedQuizzesData implementation
  }
}

class MockGroupDataService {
  currentGroupId = 1; // Mocked group ID
}

class MockNgToastService {
  success(message: any) {
    // Mock success toast method
  }
}

describe('DeleteQuizComponent', () => {
  let component: DeleteQuizComponent;
  let fixture: ComponentFixture<DeleteQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        MatButtonModule,
        DeleteQuizComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: { quizName: 'Sample Quiz', quizId: 123 } },
        { provide: QuizzesService, useClass: MockQuizzesService },
        { provide: UsersService, useClass: MockUsersService },
        { provide: ApplicationHubService, useClass: MockApplicationHubService },
        { provide: UserDataService, useClass: MockUserDataService },
        { provide: GroupDataService, useClass: MockGroupDataService },
        { provide: NgToastService, useClass: MockNgToastService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when "Cancel" button is clicked', () => {
    const cancelButton = fixture.debugElement.query(By.css('button:nth-child(2)'));
    cancelButton.nativeElement.click();

    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('should call deleteQuiz on the QuizzesService when "Delete" button is clicked', fakeAsync(() => {
    const quizzesService = TestBed.inject(QuizzesService);
    const usersService = TestBed.inject(UsersService);
    const applicationHubService = TestBed.inject(ApplicationHubService);
    const toastService = TestBed.inject(NgToastService);

    spyOn(quizzesService, 'deleteQuiz').and.callThrough();
    spyOn(usersService, 'getUserAccount').and.callThrough();
    spyOn(applicationHubService, 'deleteQuiz').and.callThrough();
    spyOn(toastService, 'success').and.callThrough();

    const deleteButton = fixture.debugElement.query(By.css('button:first-child'));
    deleteButton.nativeElement.click();

    tick(); // Simulate async operations

    expect(quizzesService.deleteQuiz).toHaveBeenCalled();
    expect(usersService.getUserAccount).toHaveBeenCalled();
    expect(applicationHubService.deleteQuiz).toHaveBeenCalledWith(1, 123); // Group ID and quiz ID
    expect(toastService.success).toHaveBeenCalledWith({
      detail: 'Success',
      summary: 'Quiz deleted!',
      duration: 3000,
    });
    expect(component.dialogRef.close).toHaveBeenCalled();
  }));
});
