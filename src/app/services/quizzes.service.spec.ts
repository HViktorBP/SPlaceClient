import { TestBed } from '@angular/core/testing';

import { QuizzesService } from './quizzes.service';
import {RouterTestingModule} from "@angular/router/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";

describe('QuizzesService', () => {
  let service: QuizzesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule]
    }).compileComponents()
    service = TestBed.inject(QuizzesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
