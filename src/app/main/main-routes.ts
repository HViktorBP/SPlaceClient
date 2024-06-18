import {Routes} from "@angular/router";
import {MainComponent} from "./main.component";

export const MAIN_ROUTES: Routes = [{
  path: '',
  component: MainComponent,
  children: [
    {path: '', redirectTo: 'home', pathMatch: 'full' },
    {path: 'group/:id', loadComponent: () => import('./group/group.component').then(m => m.GroupComponent)},
    {path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)},
    {path: 'options', loadChildren: () => import('./options/options-routes').then(m => m.OPTIONS_ROUTES)}
  ]}
];
