import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GroupHeaderComponent } from './group-header.component';
import { GroupDataService } from '../../../../../services/states/group-data.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

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
      imports: [GroupHeaderComponent],
      providers: [
        { provide: GroupDataService, useValue: mockGroupDataService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct group name', () => {
    fixture.detectChanges();
    const groupNameElement: HTMLElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(groupNameElement.textContent).toContain('Test Group');
  });

  it('should display the correct number of members', () => {
    fixture.detectChanges();
    const userCountElement: HTMLElement = fixture.debugElement.query(By.css('p')).nativeElement;
    expect(userCountElement.textContent).toContain('Members: 5');
  });
});
