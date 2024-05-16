import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmQuizComponent } from './confirm-quiz.component';

describe('ConfirmQuizComponent', () => {
  let component: ConfirmQuizComponent;
  let fixture: ComponentFixture<ConfirmQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmQuizComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
