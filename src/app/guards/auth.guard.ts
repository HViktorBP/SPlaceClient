import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {UserService} from "../services/user.service";

export const authGuard: CanActivateFn = () => {
  return (inject(UserService).isLoggedIn() && !inject(UserService).isTokenExpired()) ? true : inject(Router).navigate(['/login']);
};
