import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {authGuard} from "./guard/auth.guard";


export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'registration', loadComponent: () => import('./registration/registration.component').then(m => m.RegistrationComponent)},
  {path: 'main', loadChildren: () => import('./main/main-routes').then(routes => routes.MAIN_ROUTES), canActivate:[authGuard]},
  {path: '**', loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)},
];
