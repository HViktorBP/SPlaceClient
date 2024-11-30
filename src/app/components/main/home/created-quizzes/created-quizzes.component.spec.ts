import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CreatedQuizzesComponent } from './created-quizzes.component';
import { UserDataService } from '../../../../services/states/user-data.service';
import { of } from 'rxjs';
import { MatCard } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatLine } from "@angular/material/core";
import { MatList, MatListItem } from "@angular/material/list";
import { MatIcon } from "@angular/material/icon";
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AsyncPipe, NgForOf } from "@angular/common";
import { RouterTestingModule } from "@angular/router/testing";
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import {RouterLink} from "@angular/router";

class MockUserDataService {
  createdQuizzesAsync = of([
    { name: 'Angular Basics', id: 1, groupId: 10 },
    { name: 'Testing in Angular', id: 2, groupId: 20 }
  ]);
}

describe('CreatedQuizzesComponent', () => {
  let component: CreatedQuizzesComponent;
  let fixture: ComponentFixture<CreatedQuizzesComponent>;
  let mockUserDataService: MockUserDataService;

  beforeEach(waitForAsync(() => {
    mockUserDataService = new MockUserDataService();

    TestBed.configureTestingModule({
      imports: [
        CreatedQuizzesComponent,
        AsyncPipe,
        FaIconComponent,
        NgForOf,
        RouterLink,
        MatCard,
        MatDivider,
        MatLine,
        MatList,
        MatListItem,
        MatIcon,
        RouterTestingModule
      ],
      providers: [
        { provide: UserDataService, useValue: mockUserDataService }
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatedQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the quizzes created by the user', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      console.log(fixture.nativeElement.innerHTML);

      const matCard: DebugElement = fixture.debugElement.query(By.css('mat-card'));
      expect(matCard).toBeTruthy();

      const listItems: DebugElement[] = matCard.queryAll(By.css('mat-list-item'));
      expect(listItems.length).toBe(2);

      const firstListItem = listItems[0];
      const firstLink = firstListItem.query(By.css('a[matLine]'));
      expect(firstLink).toBeTruthy();
      expect(firstLink.nativeElement.textContent).toContain('Angular Basics');
      expect(firstLink.attributes['ng-reflect-router-link']?.toString().split(',').join('/')).toContain('/main/group/10/quiz/1');

      const secondListItem = listItems[1];
      const secondLink = secondListItem.query(By.css('a[matLine]'));
      expect(secondLink).toBeTruthy();
      expect(secondLink.nativeElement.textContent).toContain('Testing in Angular');
      expect(secondLink.attributes['ng-reflect-router-link']?.toString().split(',').join('/')).toContain('/main/group/20/quiz/2');
    });
  }));
});
