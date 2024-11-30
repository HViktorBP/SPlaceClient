import { TestBed } from '@angular/core/testing';
import { GlobalErrorHandlerService } from './global-error-handler.service';
import { NgToastService } from 'ng-angular-popup';
import { NgZone } from '@angular/core';

class MockNgZone extends NgZone {
  constructor() {
    super({ enableLongStackTrace: false });
  }
}

describe('GlobalErrorHandlerService', () => {
  let service: GlobalErrorHandlerService;
  let toastService: jasmine.SpyObj<NgToastService>;

  beforeEach(() => {
    const toastSpy = jasmine.createSpyObj('NgToastService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        GlobalErrorHandlerService,
        { provide: NgToastService, useValue: toastSpy },
        { provide: NgZone, useClass: MockNgZone },
      ],
    });

    service = TestBed.inject(GlobalErrorHandlerService);
    toastService = TestBed.inject(NgToastService) as jasmine.SpyObj<NgToastService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle 400 errors with validation errors', () => {
    const error = {
      status: 400,
      error: {
        errors: ['Validation Error 1', 'Validation Error 2']
      }
    };

    service.handleError(error);

    expect(toastService.error).toHaveBeenCalledWith({
      detail: 'Error',
      summary: 'Data that you provided is invalid! Please, consider providing valid data.',
      duration: 3000
    });
  });

  it('should handle other errors with a detail message', () => {
    const error = {
      error: {
        detail: 'Something went wrong.'
      }
    };

    service.handleError(error);

    expect(toastService.error).toHaveBeenCalledWith({
      detail: 'Error',
      summary: 'Something went wrong.',
      duration: 3000
    });
  });
});
