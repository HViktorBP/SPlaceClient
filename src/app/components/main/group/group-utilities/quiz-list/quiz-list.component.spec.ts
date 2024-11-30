import { ComponentFixture, TestBed } from '@angular/core/testing';
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
        RouterTestingModule,
        NoopAnimationsModule
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
    component.role = Role.Creator;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a list of quizzes', () => {
    const listItems = fixture.debugElement.queryAll(By.css('mat-list-item'));
    expect(listItems.length).toBe(2);

    expect(listItems[0].nativeElement.textContent).toContain('1. Quiz 1');
    expect(listItems[1].nativeElement.textContent).toContain('2. Quiz 2');
  });

  it('should render edit and delete buttons for Creator or Administrator roles', () => {
    const editButtons = fixture.debugElement.queryAll(By.css('button[title="Edit Quiz"]'));
    const deleteButtons = fixture.debugElement.queryAll(By.css('button[title="Delete Quiz"]'));

    expect(editButtons.length).toBe(2);
    expect(deleteButtons.length).toBe(2);
  });

  it('should open CreateQuizComponent dialog when clicking "Create quiz" button', () => {
    const createButton = fixture.debugElement.query(By.css('button[mat-raised-button][color="primary"]'));
    createButton.nativeElement.click();

    expect(mockDialog.open).toHaveBeenCalledWith(CreateQuizComponent, {
      width: '50vw'
    });
  });

  it('should open EditQuizComponent dialog when clicking edit button', () => {
    const editButton = fixture.debugElement.query(By.css('button[title="Edit Quiz"]'));
    editButton.nativeElement.click();

    expect(mockDialog.open).toHaveBeenCalledWith(EditQuizComponent, {
      width: '50vw',
      data: { quizId: 1 }
    });
  });

  it('should open DeleteQuizComponent dialog when clicking delete button', () => {
    const deleteButton = fixture.debugElement.query(By.css('button[title="Delete Quiz"]'));
    deleteButton.nativeElement.click();

    expect(mockDialog.open).toHaveBeenCalledWith(DeleteQuizComponent, {
      data: {
        quizName: 'Quiz 1',
        quizId: 1
      }
    });
  });
});
