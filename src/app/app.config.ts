import {ApplicationConfig, ErrorHandler} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {authInterceptor} from "./interceptors/auth.interceptor";
import {MyErrorHandlerService} from "./services/error-handling/my-error-handler.service";
import {globalHttpErrorHandlerInterceptor} from "./interceptors/global-http-error-handler.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor, globalHttpErrorHandlerInterceptor])),
    provideAnimationsAsync(),
    {
      provide : ErrorHandler,
      useClass: MyErrorHandlerService
    }
  ]
}
