import {Routes} from "@angular/router";
import {authGuard} from "../../guards/auth.guard";
import {OptionsComponent} from "./options.component";

export const OPTIONS_ROUTES : Routes = [
  {
    path:'',
    component: OptionsComponent,
    canActivate: [authGuard],
    children: [
      {path: '', redirectTo: 'change-username', pathMatch: 'full'},
      {path:'change-username', loadComponent: () => import('./change-username/change-username.component').then(m => m.ChangeUsernameComponent), canActivate:[authGuard]},
      {path:'change-password', loadComponent: () => import('./change-password/change-password.component').then(m => m.ChangePasswordComponent), canActivate:[authGuard]},
      {path:'change-status', loadComponent: () => import('./change-status/change-status.component').then(m => m.ChangeStatusComponent), canActivate:[authGuard]},
      {path:'about-app', loadComponent: () => import('./about-app/about-app.component').then(m => m.AboutAppComponent), canActivate:[authGuard]},
    ]
  },
]
