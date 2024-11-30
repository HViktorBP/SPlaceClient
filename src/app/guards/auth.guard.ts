import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {UsersService} from "../services/users.service";

/**
 * authGuard prevents from unauthorized access to the routes of the application.
 */
export const authGuard: CanActivateFn = () => {
  return (inject(UsersService).isLoggedIn() && !inject(UsersService).isTokenExpired()) ? true : inject(Router).navigate(['/login'])
}
