import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupMainComponent } from './group-main.component';
import { GroupDataService } from '../../../../services/states/group-data.service';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterOutlet } from '@angular/router';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

class MockGroupDataService {
}

describe('GroupMainComponent', () => {
  let component: GroupMainComponent;
  let fixture: ComponentFixture<GroupMainComponent>;
  let mockGroupDataService: MockGroupDataService;

  beforeEach(async () => {
    mockGroupDataService = new MockGroupDataService();

    await TestBed.configureTestingModule({
      imports: [
        GroupMainComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: GroupDataService, useValue: mockGroupDataService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a router outlet', () => {
    const routerOutlet: DebugElement = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(routerOutlet).toBeTruthy();
  });
});
