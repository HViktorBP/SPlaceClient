import {Routes} from "@angular/router";
import {MainComponent} from "./main.component";
import {authGuard} from "../guard/auth.guard";

export const MAIN_ROUTES: Routes = [
    {
    path: '',
    component: MainComponent,
    canActivate: [authGuard],
    children: [
        {path: '', redirectTo: 'home', pathMatch: 'full' },
        {path: 'group', loadComponent: () => import('./group/group.component').then(m => m.GroupComponent), canActivate: [authGuard]},
        {path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent), canActivate: [authGuard]},
        {path: 'options', loadChildren: () => import('./options/options-routes').then(m => m.OPTIONS_ROUTES), canActivate: [authGuard]}
    ]
    }
];
