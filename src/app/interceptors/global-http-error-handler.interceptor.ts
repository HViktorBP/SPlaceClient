import { HttpInterceptorFn } from '@angular/common/http';
import {retry, timer} from "rxjs";

/**
 * globalHttpErrorHandlerInterceptor tries to send the request multiple times to server, with some short time break, if it had failed.
 * @param req - The outgoing HTTP request object to be intercepted.
 * @param next - The next interceptor in the chain.
 * @returns - An observable that will send the modified request.
 */

export const globalHttpErrorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: 2,
      delay: (_, retryCount) => timer(retryCount * 1000)
    })
  )
}
