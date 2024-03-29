import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {MainComponent} from "./main/main.component";
import {RegistrationComponent} from "./registration/registration.component";
import {authGuard} from "./guard/auth.guard";

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'main', component: MainComponent, canActivate:[authGuard]},
  {path: 'registration', component: RegistrationComponent},
];
