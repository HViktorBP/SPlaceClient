import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ParticipantsComponent } from './participants.component';
import { GroupDataService } from '../../../../../../services/states/group-data.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

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
        ParticipantsComponent,
        MatCardModule,
        MatListModule,
        MatTooltipModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: GroupDataService, useValue: mockGroupDataService }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of participants', () => {
    const listItems = fixture.debugElement.queryAll(By.css('mat-list-item'));
    expect(listItems.length).toBe(3);

    expect(listItems[0].nativeElement.textContent).toContain('1. Alice');
    expect(listItems[1].nativeElement.textContent).toContain('2. Bob');
    expect(listItems[2].nativeElement.textContent).toContain('3. Charlie');
  });

  it('should display the correct tooltips for each participant', () => {
    const listItems = fixture.debugElement.queryAll(By.css('mat-list-item'));

    expect(listItems[0].attributes['ng-reflect-message']).toBe('Status: active');
    expect(listItems[1].attributes['ng-reflect-message']).toBe('Status: inactive');
    expect(listItems[2].attributes['ng-reflect-message']).toBe('Status: active');
  });
});
