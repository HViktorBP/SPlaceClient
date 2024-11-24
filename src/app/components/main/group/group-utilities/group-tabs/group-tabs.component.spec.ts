import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
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
    fixture.detectChanges(); // Trigger initial change detection to apply template logic
  });

  afterEach(() => {
    fixture.destroy(); // Properly destroy the fixture after each test
  });

  it('should create', () => {
    // Test that the component is successfully created
    expect(component).toBeTruthy();
  });

  it('should render a MatTabGroup', () => {
    // Test that a MatTabGroup is rendered in the component
    const tabGroupElement = fixture.debugElement.query(By.css('mat-tab-group'));
    expect(tabGroupElement).toBeTruthy();
  });

  it('should have two tabs labeled "Participants" and "Scores"', () => {
    // Test that the MatTabGroup contains the correct tab labels
    fixture.detectChanges(); // Trigger initial change detection

    // Query for all tab labels using the correct selector for MDC-based tabs
    const tabLabels = fixture.debugElement.queryAll(By.css('.mdc-tab__text-label'));
    expect(tabLabels.length).toBe(2);
    expect(tabLabels[0].nativeElement.textContent).toContain('Participants');
    expect(tabLabels[1].nativeElement.textContent).toContain('Scores');
  });

  it('should initially display the Participants tab', () => {
    // Test that the initial active tab is the Participants tab
    fixture.detectChanges();
    const tabGroupElement = fixture.debugElement.query(By.css('mat-tab-group')).componentInstance;

    // Check that the initially selected index is 0 (Participants tab)
    expect(tabGroupElement.selectedIndex).toBe(0);
  });
});
