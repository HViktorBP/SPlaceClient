import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {NgToastService} from "ng-angular-popup";

@Injectable({
  providedIn: 'root'
})
export class MyErrorHandlerService implements ErrorHandler {

  constructor(private toast : NgToastService,
              private ngZone : NgZone) { }

  handleError(error: any): void {
    console.log(error);
    this.ngZone.run(() => {
      if (error.status === 400 && error.error.errors) {
        this.toast.error({ detail: "Error", summary: 'Data that you provided is invalid! Please, consider providing valid data.', duration: 3000 })
      } else {
        this.toast.error({ detail: "Error", summary: error.error.detail, duration: 3000 })
      }
    })
  }
}
