import {TestBed} from '@angular/core/testing';

import {ApplicationHubService} from './application-hub.service';
import {RouterTestingModule} from "@angular/router/testing";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppHubService', () => {
  let service: ApplicationHubService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents()
    service = TestBed.inject(ApplicationHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
