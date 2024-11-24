import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ScoresComponent } from './scores.component';
import { GroupDataService } from '../../../../../../services/states/group-data.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Mock GroupDataService
class MockGroupDataService {
  groupScoresAsync = of([
    {
      quizName: 'Quiz 1',
      scores: [
        { username: 'Alice', score: 9.5 },
        { username: 'Bob', score: 8.8 }
      ]
    }
  ]);
}

describe('ScoresComponent', () => {
  let component: ScoresComponent;
  let fixture: ComponentFixture<ScoresComponent>;
  let mockGroupDataService: MockGroupDataService;

  beforeEach(waitForAsync(() => {
    mockGroupDataService = new MockGroupDataService();

    TestBed.configureTestingModule({
      imports: [
        ScoresComponent,    // Import the standalone component directly
        MatCardModule,      // Import necessary Angular Material modules
        MatListModule,
        MatTabsModule,
        NoopAnimationsModule // Disable animations for testing purposes
      ],
      providers: [
        { provide: GroupDataService, useValue: mockGroupDataService } // Provide the mock service
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial change detection to apply template logic
  });

  afterEach(() => {
    fixture.destroy(); // Clean up the fixture after each test
  });

  it('should create', () => {
    // Test to ensure that the component is created successfully
    expect(component).toBeTruthy();
  });

  it('should render a MatTabGroup with quiz tabs', () => {
    // Test to ensure that the MatTabGroup is rendered with quiz tabs
    const tabGroupElement = fixture.debugElement.query(By.css('mat-tab-group'));
    expect(tabGroupElement).toBeTruthy();

    // Query for the tabs
    const tabLabels = fixture.debugElement.queryAll(By.css('.mdc-tab__text-label'));
    expect(tabLabels.length).toBe(1); // Ensure there are two quizzes
    expect(tabLabels[0].nativeElement.textContent).toContain('Quiz 1');
  });

  it('should render scores for each quiz in the correct tab', waitForAsync(async () => {
    // Test to ensure that the scores are rendered correctly for each quiz
    fixture.detectChanges();
    await fixture.whenStable(); // Wait for all async operations to finish

    // Verify the first quiz tab
    const tabLabels = fixture.debugElement.queryAll(By.css('.mdc-tab__text-label'));
    tabLabels[0].nativeElement.click(); // Select the "Quiz 1" tab
    fixture.detectChanges();
    await fixture.whenStable(); // Wait for any asynchronous changes

    // Check scores for "Quiz 1"
    let listItems = fixture.debugElement.queryAll(By.css('mat-list-item'));
    expect(listItems.length).toBe(2); // There should be two scores
    expect(listItems[0].nativeElement.textContent.trim()).toContain('1. Alice - 9.5');
    expect(listItems[1].nativeElement.textContent.trim()).toContain('2. Bob - 8.8');
  }));
});
