import { Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {MainComponent} from "./main/main.component";
import {RegistrationComponent} from "./registration/registration.component";
import {authGuard} from "./guard/auth.guard";
import {GroupComponent} from "./main/group/group.component";
import {NotFoundComponent} from "./not-found/not-found.component";
import {HomeComponent} from "./main/home/home.component";

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'main', component: MainComponent, canActivate:[authGuard], children:[
      {path:'home', component: HomeComponent, canActivate:[authGuard]},
      {path:'group/:name/:id', component: GroupComponent, canActivate:[authGuard]}
    ]},
  {path: 'registration', component: RegistrationComponent},
  {path: '**', component: NotFoundComponent},
];
