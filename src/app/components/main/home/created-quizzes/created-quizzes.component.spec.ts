import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CreatedQuizzesComponent} from './created-quizzes.component';

describe('QuizInfoComponent', () => {
  let component: CreatedQuizzesComponent;
  let fixture: ComponentFixture<CreatedQuizzesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedQuizzesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
