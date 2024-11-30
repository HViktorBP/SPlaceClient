import {Routes} from "@angular/router";
import {MainComponent} from "./main.component";

export const MAIN_ROUTES: Routes = [{
  path: '',
  component: MainComponent,
  children: [
    {path: '', redirectTo: 'home', pathMatch: 'full' },
    {path: 'group/:groupId', loadChildren: () => import('./group/group-routes').then(m => m.GROUP_ROUTES)},
    {path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)},
  ]}
];
