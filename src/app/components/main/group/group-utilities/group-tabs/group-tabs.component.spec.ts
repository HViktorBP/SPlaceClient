import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GroupTabsComponent } from './group-tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // To disable animations
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({
  selector: 'app-participants',
  template: '<div>Mock Participants Component</div>'
})
class MockParticipantsComponent {}

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
        GroupTabsComponent,
        MatTabsModule,
        NoopAnimationsModule
      ],
      declarations: [
        MockParticipantsComponent,
        MockScoresComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a MatTabGroup', () => {
    const tabGroupElement = fixture.debugElement.query(By.css('mat-tab-group'));
    expect(tabGroupElement).toBeTruthy();
  });

  it('should have two tabs labeled "Participants" and "Scores"', () => {
    fixture.detectChanges();

    const tabLabels = fixture.debugElement.queryAll(By.css('.mdc-tab__text-label'));
    expect(tabLabels.length).toBe(2);
    expect(tabLabels[0].nativeElement.textContent).toContain('Participants');
    expect(tabLabels[1].nativeElement.textContent).toContain('Scores');
  });

  it('should initially display the Participants tab', () => {
    fixture.detectChanges();
    const tabGroupElement = fixture.debugElement.query(By.css('mat-tab-group')).componentInstance;

    expect(tabGroupElement.selectedIndex).toBe(0);
  });
});
