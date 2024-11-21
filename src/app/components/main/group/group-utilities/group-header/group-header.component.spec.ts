import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GroupHeaderComponent } from './group-header.component';
import { GroupDataService } from '../../../../../services/states/group-data.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

// Mock GroupDataService
class MockGroupDataService {
  groupNameAsync = of('Test Group');
  userCountAsync = of(5);
}

describe('GroupHeaderComponent', () => {
  let component: GroupHeaderComponent;
  let fixture: ComponentFixture<GroupHeaderComponent>;
  let mockGroupDataService: MockGroupDataService;

  beforeEach(waitForAsync(() => {
    mockGroupDataService = new MockGroupDataService();

    TestBed.configureTestingModule({
      imports: [GroupHeaderComponent], // Import the standalone component directly
      providers: [
        { provide: GroupDataService, useValue: mockGroupDataService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger change detection to apply template logic
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct group name', () => {
    fixture.detectChanges(); // Trigger change detection for the async pipe to receive emitted value
    const groupNameElement: HTMLElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(groupNameElement.textContent).toContain('Test Group');
  });

  it('should display the correct number of members', () => {
    fixture.detectChanges(); // Trigger change detection for the async pipe to receive emitted value
    const userCountElement: HTMLElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(userCountElement.textContent).toContain('Members: 5');
  });
});
