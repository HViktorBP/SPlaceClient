import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizListComponent } from './quiz-list.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";

describe('QuizComponent', () => {
  let component: QuizListComponent;
  let fixture: ComponentFixture<QuizListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizListComponent, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuizListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
