import {ComponentFixture, TestBed} from '@angular/core/testing';

import {UserScoresComponent} from './user-scores.component';

describe('UserScoresComponent', () => {
  let component: UserScoresComponent;
  let fixture: ComponentFixture<UserScoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserScoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
