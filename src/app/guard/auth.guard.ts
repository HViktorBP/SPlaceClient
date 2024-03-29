import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthorisationService} from "../services/authorisation.service";

export const authGuard: CanActivateFn = () => {
  return inject(AuthorisationService).isLoggedIn() ? true : inject(Router).navigate(['login']);
};

