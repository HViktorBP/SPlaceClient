import {Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {authGuard} from "./guards/auth.guard";


export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'registration', loadComponent: () => import('./components/registration/registration.component').then(m => m.RegistrationComponent)},
  {path: 'main', loadChildren: () => import('./components/main/main-routes').then(routes => routes.MAIN_ROUTES), canActivate:[authGuard], canActivateChild:[authGuard]},
  {path: '**', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent)},
];
