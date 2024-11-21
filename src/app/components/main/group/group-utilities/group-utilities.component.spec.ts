import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GroupUtilitiesComponent } from './group-utilities.component';
import { GroupDataService } from '../../../../services/states/group-data.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import { Role } from '../../../../data-transferring/enums/role';
import { By } from '@angular/platform-browser';
import { ApplicationHubService } from '../../../../services/application-hub.service';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; // <-- Add this import

// Mock Services
class MockGroupDataService {
  userRoleAsync = new BehaviorSubject<Role>(Role.Administrator);
}

class MockApplicationHubService {
  // Add any necessary mock methods or properties
}

describe('GroupUtilitiesComponent', () => {
  let component: GroupUtilitiesComponent;
  let fixture: ComponentFixture<GroupUtilitiesComponent>;
  let mockGroupDataService: MockGroupDataService;

  beforeEach(waitForAsync(() => {
    mockGroupDataService = new MockGroupDataService();

    TestBed.configureTestingModule({
      imports: [
        GroupUtilitiesComponent, // Import the standalone component directly
        HttpClientModule,        // Import HttpClientModule to provide HttpClient dependency
        NoopAnimationsModule     // Import NoopAnimationsModule to handle animations in the test environment
      ],
      providers: [
        { provide: GroupDataService, useValue: mockGroupDataService },
        { provide: ApplicationHubService, useClass: MockApplicationHubService } // Provide a mock ApplicationHubService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupUtilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger change detection to apply template logic
  });

  afterEach(() => {
    mockGroupDataService.userRoleAsync.complete(); // Complete the subject after each test
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to user role changes and update userRole', () => {
    mockGroupDataService.userRoleAsync.next(Role.Administrator);
    fixture.detectChanges();

    expect(component.userRole).toBe(Role.Administrator);

    mockGroupDataService.userRoleAsync.next(Role.Moderator);
    fixture.detectChanges();

    expect(component.userRole).toBe(Role.Moderator);
  });

  it('should pass the correct role to GroupOptionsComponent and QuizListComponent', () => {
    // Set user role to Administrator through the mocked service.
    mockGroupDataService.userRoleAsync.next(Role.Administrator);
    fixture.detectChanges();

    // Find child components in the template.
    const groupOptionsDebugElement = fixture.debugElement.query(By.css('app-group-options'));
    const quizListDebugElement = fixture.debugElement.query(By.css('app-quiz-list'));

    // Ensure that both components exist.
    expect(groupOptionsDebugElement).toBeTruthy();
    expect(quizListDebugElement).toBeTruthy();

    // Access the component instance to verify the role input value.
    const groupOptionsComponent = groupOptionsDebugElement.componentInstance;
    const quizListComponent = quizListDebugElement.componentInstance;

    expect(groupOptionsComponent.role).toBe(Role.Administrator);
    expect(quizListComponent.role).toBe(Role.Administrator);
  });

  it('should unsubscribe from user role subscription on destroy', () => {
    const roleSubscription = new Subscription();
    component['roleSubscription'] = roleSubscription;
    spyOn(roleSubscription, 'unsubscribe');

    component.ngOnDestroy();
    expect(roleSubscription.unsubscribe).toHaveBeenCalled();
  });
});
