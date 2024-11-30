import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { CreatedQuizzesComponent } from './created-quizzes/created-quizzes.component';
import { CreatedGroupsComponent } from './created-groups/created-groups.component';
import { UserScoresComponent } from './user-scores/user-scores.component';
import { MatGridList, MatGridTile, MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        CreatedQuizzesComponent,
        CreatedGroupsComponent,
        UserScoresComponent,
        MatGridList,
        MatGridTile,
        MatGridTileHeaderCssMatStyler,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render CreatedQuizzesComponent, CreatedGroupsComponent, and UserScoresComponent', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-created-quizzes')).not.toBeNull();
    expect(compiled.querySelector('app-created-groups')).not.toBeNull();
    expect(compiled.querySelector('app-user-scores')).not.toBeNull();
  });
});
