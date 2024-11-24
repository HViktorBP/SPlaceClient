import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ParticipantsComponent } from './participants.component';
import { GroupDataService } from '../../../../../../services/states/group-data.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Mock GroupDataService
class MockGroupDataService {
  userListAsync = of([
    { username: 'Alice', status: 'active' },
    { username: 'Bob', status: 'inactive' },
    { username: 'Charlie', status: 'active' }
  ]);
}

describe('ParticipantsComponent', () => {
  let component: ParticipantsComponent;
  let fixture: ComponentFixture<ParticipantsComponent>;
  let mockGroupDataService: MockGroupDataService;

  beforeEach(waitForAsync(() => {
    mockGroupDataService = new MockGroupDataService();

    TestBed.configureTestingModule({
      imports: [
        ParticipantsComponent, // Import the standalone component directly
        MatCardModule,         // Import necessary Angular Material modules
        MatListModule,
        MatTooltipModule,
        NoopAnimationsModule   // Disable animations to simplify testing
      ],
      providers: [
        { provide: GroupDataService, useValue: mockGroupDataService } // Provide the mock service
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsComponent);
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

  it('should display a list of participants', () => {
    // Test to ensure that the participants list is rendered
    const listItems = fixture.debugElement.queryAll(By.css('mat-list-item'));
    expect(listItems.length).toBe(3); // Ensure there are 3 participants as in the mock data

    // Check the content of each list item
    expect(listItems[0].nativeElement.textContent).toContain('1. Alice');
    expect(listItems[1].nativeElement.textContent).toContain('2. Bob');
    expect(listItems[2].nativeElement.textContent).toContain('3. Charlie');
  });

  it('should display the correct tooltips for each participant', () => {
    // Test to ensure that the tooltips are rendered correctly
    const listItems = fixture.debugElement.queryAll(By.css('mat-list-item'));

    // Check tooltip attributes for each participant
    expect(listItems[0].attributes['ng-reflect-message']).toBe('Status: active');
    expect(listItems[1].attributes['ng-reflect-message']).toBe('Status: inactive');
    expect(listItems[2].attributes['ng-reflect-message']).toBe('Status: active');
  });
});
