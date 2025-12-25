import {ApplicationConfig, ErrorHandler} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {authInterceptor} from "./interceptors/auth.interceptor";
import {GlobalErrorHandlerService} from "./services/error-handling/global-error-handler.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    {
      provide : ErrorHandler,
      useClass: GlobalErrorHandlerService
    }
  ]
}
