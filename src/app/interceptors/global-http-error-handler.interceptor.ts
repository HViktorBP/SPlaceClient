import { HttpInterceptorFn } from '@angular/common/http';
import {retry, timer} from "rxjs";

export const globalHttpErrorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: 2,
      delay: (_, retryCount) => timer(retryCount * 1000)
    })
  )
}
