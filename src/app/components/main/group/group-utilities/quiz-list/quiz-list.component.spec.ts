import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { QuizListComponent } from './quiz-list.component';
import { GroupDataService } from '../../../../../services/states/group-data.service';
import { ApplicationHubService } from '../../../../../services/application-hub.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Role } from '../../../../../data-transferring/enums/role';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';
import {DeleteQuizComponent} from "./delete-quiz/delete-quiz.component";
import {EditQuizComponent} from "./edit-quiz/edit-quiz.component";
import {CreateQuizComponent} from "./create-quiz/create-quiz.component";

// Mock Services
class MockGroupDataService {
  quizzesListAsync = of([
    { id: 1, name: 'Quiz 1', groupId: 101 },
    { id: 2, name: 'Quiz 2', groupId: 102 },
  ]);
}

describe('QuizListComponent', () => {
  let component: QuizListComponent;
  let fixture: ComponentFixture<QuizListComponent>;
  let mockGroupDataService: MockGroupDataService;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockGroupDataService = new MockGroupDataService();
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        QuizListComponent,
        MatCardModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        RouterTestingModule, // For handling the routerLink in the template
        NoopAnimationsModule // To disable animations during testing
      ],
      providers: [
        { provide: GroupDataService, useValue: mockGroupDataService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ApplicationHubService, useValue: {} }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizListComponent);
    component = fixture.componentInstance;
    component.role = Role.Creator; // Setting role to Creator for testing buttons
    fixture.detectChanges(); // Trigger initial change detection
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a list of quizzes', () => {
    // Ensure quizzes are rendered properly
    const listItems = fixture.debugElement.queryAll(By.css('mat-list-item'));
    expect(listItems.length).toBe(2); // Should render two quizzes

    expect(listItems[0].nativeElement.textContent).toContain('1. Quiz 1');
    expect(listItems[1].nativeElement.textContent).toContain('2. Quiz 2');
  });

  it('should render edit and delete buttons for Creator or Administrator roles', () => {
    // Query all buttons in the quiz list items
    const editButtons = fixture.debugElement.queryAll(By.css('button[title="Edit Quiz"]'));
    const deleteButtons = fixture.debugElement.queryAll(By.css('button[title="Delete Quiz"]'));

    // Ensure there are edit and delete buttons for each quiz
    expect(editButtons.length).toBe(2);
    expect(deleteButtons.length).toBe(2);
  });

  it('should open CreateQuizComponent dialog when clicking "Create quiz" button', () => {
    // Find the "Create quiz" button and click it
    const createButton = fixture.debugElement.query(By.css('button[mat-raised-button][color="primary"]'));
    createButton.nativeElement.click();

    // Expect MatDialog's open method to be called with CreateQuizComponent
    expect(mockDialog.open).toHaveBeenCalledWith(CreateQuizComponent, {
      width: '50vw'
    });
  });

  it('should open EditQuizComponent dialog when clicking edit button', () => {
    // Find the first "Edit Quiz" button and click it
    const editButton = fixture.debugElement.query(By.css('button[title="Edit Quiz"]'));
    editButton.nativeElement.click();

    // Expect MatDialog's open method to be called with EditQuizComponent
    expect(mockDialog.open).toHaveBeenCalledWith(EditQuizComponent, {
      width: '50vw',
      data: { quizId: 1 } // Since we clicked on the first quiz
    });
  });

  it('should open DeleteQuizComponent dialog when clicking delete button', () => {
    // Find the first "Delete Quiz" button and click it
    const deleteButton = fixture.debugElement.query(By.css('button[title="Delete Quiz"]'));
    deleteButton.nativeElement.click();

    // Expect MatDialog's open method to be called with DeleteQuizComponent
    expect(mockDialog.open).toHaveBeenCalledWith(DeleteQuizComponent, {
      data: {
        quizName: 'Quiz 1',
        quizId: 1
      }
    });
  });
});
