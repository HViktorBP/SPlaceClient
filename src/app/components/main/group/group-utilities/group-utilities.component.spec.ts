import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GroupUtilitiesComponent } from './group-utilities.component';
import { GroupDataService } from '../../../../services/states/group-data.service';
import {BehaviorSubject, Subscription} from 'rxjs';
import { Role } from '../../../../data-transferring/enums/role';
import { By } from '@angular/platform-browser';
import { ApplicationHubService } from '../../../../services/application-hub.service';
import { HttpClientModule } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

class MockGroupDataService {
  userRoleAsync = new BehaviorSubject<Role>(Role.Administrator);
}

class MockApplicationHubService {
}

describe('GroupUtilitiesComponent', () => {
  let component: GroupUtilitiesComponent;
  let fixture: ComponentFixture<GroupUtilitiesComponent>;
  let mockGroupDataService: MockGroupDataService;

  beforeEach(waitForAsync(() => {
    mockGroupDataService = new MockGroupDataService();

    TestBed.configureTestingModule({
      imports: [
        GroupUtilitiesComponent,
        HttpClientModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: GroupDataService, useValue: mockGroupDataService },
        { provide: ApplicationHubService, useClass: MockApplicationHubService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupUtilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    mockGroupDataService.userRoleAsync.complete();
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
    mockGroupDataService.userRoleAsync.next(Role.Administrator);
    fixture.detectChanges();

    const groupOptionsDebugElement = fixture.debugElement.query(By.css('app-group-options'));
    const quizListDebugElement = fixture.debugElement.query(By.css('app-quiz-list'));

    expect(groupOptionsDebugElement).toBeTruthy();
    expect(quizListDebugElement).toBeTruthy();

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
