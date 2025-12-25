import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {NgToastService} from "ng-angular-popup";

@Injectable({
  providedIn: 'root'
})

/**
 * GlobalErrorHandlerService provides a service for handling errors in application.
 */
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(private toast : NgToastService,
              private ngZone : NgZone) { }

  /**
   * handleError method handles the errors in application by showing them to user via NgToastService
   * @param error - occurred error
   */
  handleError(error: Error | HttpErrorResponse): void {
    this.ngZone.run(() => {
      // Only show HTTP errors as toasts
      if (error instanceof HttpErrorResponse) {
        if (error.status === 400 && error.error?.errors) {
          this.toast.error({ detail: "Error", summary: 'Data that you provided is invalid! Please, consider providing valid data.', duration: 3000 })
        } else if (error.error?.detail) {
          this.toast.error({ detail: "Error", summary: error.error.detail, duration: 3000 })
        } else if (error.message) {
          this.toast.error({ detail: "Error", summary: error.message, duration: 3000 })
        }
      } else {
        // Log non-HTTP errors to console for debugging, but don't show to user
        console.error('Application error:', error)
      }
    })
  }
}
