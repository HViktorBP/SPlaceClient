import {ErrorHandler, Injectable, NgZone} from '@angular/core';
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
  handleError(error: any): void {
    console.log(error)
    this.ngZone.run(() => {
      if (error.status === 400 && error.error.errors) {
        this.toast.error({ detail: "Error", summary: 'Data that you provided is invalid! Please, consider providing valid data.', duration: 3000 })
      } else {
        this.toast.error({ detail: "Error", summary: error.error.detail, duration: 3000 })
      }
    })
  }
}
