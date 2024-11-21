import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserScoresComponent } from './user-scores.component';
import { UserDataService } from '../../../../services/states/user-data.service';
import { of } from 'rxjs';
import { MatCard } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatLine } from "@angular/material/core";
import { MatList, MatListItem } from "@angular/material/list";
import { MatIcon } from "@angular/material/icon";
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgForOf, NgIf } from "@angular/common";
import { QuizScores } from '../../../../data-transferring/dtos/score/quiz-scores';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Mock UserDataService
class MockUserDataService {
  userScoresAsync = of<QuizScores[]>([
    {
      quizName: 'Quiz 1',
      scores: [
        { username: 'Alice', score: 3.1 },
      ]
    },
    {
      quizName: 'Quiz 2',
      scores: [
        { username: 'Alice', score: 8.4 },
      ]
    }
  ]);
}

describe('UserScoresComponent', () => {
  let component: UserScoresComponent;
  let fixture: ComponentFixture<UserScoresComponent>;
  let mockUserDataService: MockUserDataService;

  beforeEach(fakeAsync(() => {
    mockUserDataService = new MockUserDataService();

    TestBed.configureTestingModule({
      imports: [
        UserScoresComponent, // Import the standalone component directly
        AsyncPipe,
        NgForOf,
        NgIf,
        FaIconComponent,
        MatCard,
        MatDivider,
        MatLine,
        MatList,
        MatListItem,
        MatIcon
      ],
      providers: [
        { provide: UserDataService, useValue: mockUserDataService }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial change detection
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display quizzes and user scores', fakeAsync(() => {
    // Allow observable to emit data
    tick();
    fixture.detectChanges(); // Trigger change detection after data has arrived

    // There should be one mat-card element
    const matCard: DebugElement = fixture.debugElement.query(By.css('mat-card'));
    expect(matCard).toBeTruthy();

    // Check if mat-list-item elements are rendered inside the mat-card
    const listItems: DebugElement[] = matCard.queryAll(By.css('mat-list-item'));
    expect(listItems.length).toBe(2); // Expect two list items for two quizzes

    // Check the content of the first list item (Quiz 1)
    const firstListItem = listItems[0];
    const firstLink = firstListItem.query(By.css('a'));
    expect(firstLink).toBeTruthy(); // Check if <a> tag exists
    expect(firstLink.nativeElement.textContent).toContain('Quiz 1');
    expect(firstLink.nativeElement.textContent).toContain('3.1');

    // Check the content of the second list item (Quiz 2)
    const secondListItem = listItems[1];
    const secondLink = secondListItem.query(By.css('a'));
    expect(secondLink).toBeTruthy(); // Check if <a> tag exists
    expect(secondLink.nativeElement.textContent).toContain('Quiz 2');
    expect(secondLink.nativeElement.textContent).toContain('8.4');
  }));
});
