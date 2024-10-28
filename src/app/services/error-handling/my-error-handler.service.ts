import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {NgToastService} from "ng-angular-popup";

@Injectable({
  providedIn: 'root'
})
export class MyErrorHandlerService implements ErrorHandler {

  constructor(private toast : NgToastService,
              private ngZone : NgZone) { }

  handleError(error: any): void {
    this.ngZone.run(() => {
      this.toast.error({ detail: "Error", summary: error.error.detail, duration: 3000 })
    })
  }
}
