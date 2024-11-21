import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupMainComponent } from './group-main.component';
import { GroupDataService } from '../../../../services/states/group-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

// Mock GroupDataService
class MockGroupDataService {
  // Add any required mock methods or properties if necessary
}

describe('GroupMainComponent', () => {
  let component: GroupMainComponent;
  let fixture: ComponentFixture<GroupMainComponent>;
  let mockGroupDataService: MockGroupDataService;

  beforeEach(async () => {
    mockGroupDataService = new MockGroupDataService();

    await TestBed.configureTestingModule({
      imports: [
        GroupMainComponent, // Import the standalone component directly
        RouterTestingModule // Needed for RouterOutlet testing
      ],
      providers: [
        { provide: GroupDataService, useValue: mockGroupDataService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger change detection
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a router outlet', () => {
    // Check that the RouterOutlet is present
    const routerOutlet: DebugElement = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).toBeTruthy();
  });
});
