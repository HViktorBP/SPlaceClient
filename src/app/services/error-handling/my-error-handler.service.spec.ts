import { TestBed } from '@angular/core/testing';

import { MyErrorHandlerService } from './my-error-handler.service';

describe('MyErrorHandlerService', () => {
  let service: MyErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
