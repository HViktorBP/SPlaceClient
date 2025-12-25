import { HttpInterceptorFn } from '@angular/common/http';

/**
 * authInterceptor adds user's JWT token to the HTTP request.
 * @param req - The outgoing HTTP request object to be intercepted.
 * @param next - The next interceptor in the chain.
 * @returns - An observable that will send the modified request.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('token')
  
  // Only add Authorization header if token exists
  if (token) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    })
  }
  
  return next(req)
}
