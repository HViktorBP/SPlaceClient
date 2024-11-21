import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { GroupTabsComponent } from './group-tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // To disable animations
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

// Mock ParticipantsComponent
@Component({
  selector: 'app-participants',
  template: '<div>Mock Participants Component</div>'
})
class MockParticipantsComponent {}

// Mock ScoresComponent
@Component({
  selector: 'app-scores',
  template: '<div>Mock Scores Component</div>'
})
class MockScoresComponent {}

describe('GroupTabsComponent', () => {
  let component: GroupTabsComponent;
  let fixture: ComponentFixture<GroupTabsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        GroupTabsComponent, // Import the standalone component directly
        MatTabsModule,      // Import MatTabsModule for the MatTabGroup functionality
        NoopAnimationsModule // Import NoopAnimationsModule to handle animations in the test environment
      ],
      declarations: [
        MockParticipantsComponent, // Provide Mock ParticipantsComponent for testing
        MockScoresComponent        // Provide Mock ScoresComponent for testing
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger change detection to apply template logic
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should render two tabs', fakeAsync(() => {
  //   fixture.detectChanges(); // Trigger initial change detection
  //   tick(); // Simulate the passage of time to let MatTabGroup finish rendering
  //
  //   // Query for all tab labels
  //   const tabLabels = fixture.debugElement.queryAll(By.css('.mat-tab-label-content'));
  //   expect(tabLabels.length).toBe(2);
  //   expect(tabLabels[0].nativeElement.textContent).toContain('Participants');
  //   expect(tabLabels[1].nativeElement.textContent).toContain('Scores');
  // }));

  it('should display ParticipantsComponent when the Participants tab is active', fakeAsync(() => {
    const tabGroup = fixture.debugElement.query(By.css('mat-tab-group')).componentInstance;
    tabGroup.selectedIndex = 0; // Select the Participants tab
    fixture.detectChanges();
    tick(); // Simulate the passage of time to let content render

    // Query for the ParticipantsComponent
    const participantsComponent = fixture.debugElement.query(By.css('app-participants'));
    expect(participantsComponent).toBeTruthy();
  }));

  // it('should display ScoresComponent when the Scores tab is active', fakeAsync(() => {
  //   const tabGroup = fixture.debugElement.query(By.css('mat-tab-group')).componentInstance;
  //   tabGroup.selectedIndex = 1; // Select the Scores tab
  //   fixture.detectChanges();
  //   tick(); // Simulate the passage of time to let content render
  //
  //   // Query for the ScoresComponent
  //   const scoresComponent = fixture.debugElement.query(By.css('app-scores'));
  //   expect(scoresComponent).toBeTruthy();
  // }));
});
