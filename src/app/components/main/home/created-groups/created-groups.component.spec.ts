import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CreatedGroupsComponent } from './created-groups.component';
import { UserDataService } from '../../../../services/states/user-data.service';
import { of } from 'rxjs';
import { MatCard } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatLine } from "@angular/material/core";
import { MatList, MatListItem } from "@angular/material/list";
import { MatIcon } from "@angular/material/icon";
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgForOf, NgIf, SlicePipe } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import {RouterLink} from "@angular/router";

// Mock UserDataService
class MockUserDataService {
  createdGroupsAsync = of([
    { name: 'Group A', id: 1 },
    { name: 'Group B', id: 2 }
  ]);
}

describe('CreatedGroupsComponent', () => {
  let component: CreatedGroupsComponent;
  let fixture: ComponentFixture<CreatedGroupsComponent>;
  let mockUserDataService: MockUserDataService;

  beforeEach(waitForAsync(() => {
    mockUserDataService = new MockUserDataService();

    TestBed.configureTestingModule({
      imports: [
        CreatedGroupsComponent, // Import the standalone component directly
        NgForOf,
        RouterLink,
        AsyncPipe,
        SlicePipe,
        FaIconComponent,
        MatCard,
        MatList,
        MatListItem,
        MatLine,
        MatDivider,
        NgIf,
        MatIcon,
        RouterTestingModule // Needed for RouterLink to work properly
      ],
      providers: [
        { provide: UserDataService, useValue: mockUserDataService }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger change detection to apply template logic
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display groups created by the user', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges(); // Ensure that the component view has been updated

      // Log the HTML for debugging
      console.log(fixture.nativeElement.innerHTML);

      // Query the mat-card element
      const matCard: DebugElement = fixture.debugElement.query(By.css('mat-card'));
      expect(matCard).toBeTruthy(); // Check that the mat-card exists

      // Query the list items within the mat-card
      const listItems: DebugElement[] = matCard.queryAll(By.css('mat-list-item'));
      expect(listItems.length).toBe(2); // Expect two list items for two groups

      // Check the content of the first list item (Group A)
      const firstListItem = listItems[0];
      const firstLink = firstListItem.query(By.css('a[matLine]'));
      expect(firstLink).toBeTruthy(); // Check if <a> tag exists
      expect(firstLink.nativeElement.textContent).toContain('Group A');
      expect(firstLink.attributes['ng-reflect-router-link']?.toString().split(',').join('/')).toContain('/main/group/1');

      // Check the content of the second list item (Group B)
      const secondListItem = listItems[1];
      const secondLink = secondListItem.query(By.css('a[matLine]'));
      expect(secondLink).toBeTruthy(); // Check if <a> tag exists
      expect(secondLink.nativeElement.textContent).toContain('Group B');
      expect(secondLink.attributes['ng-reflect-router-link']?.toString().split(',').join('/')).toContain('/main/group/2');
    });
  }));
});
