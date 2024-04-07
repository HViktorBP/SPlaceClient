import {Component, Input} from '@angular/core';
import {MenuComponent} from "../side-bar/menu/menu.component";
import {LogoComponent} from "./logo/logo.component";
import {UserMenuComponent} from "./user-menu/user-menu.component";

@Component({
  selector: 'app-main-bar',
  standalone: true,
  imports: [
    MenuComponent,
    LogoComponent,
    UserMenuComponent
  ],
  templateUrl: './main-bar.component.html',
  styleUrl: './main-bar.component.css'
})
export class MainBarComponent {
  @Input({required:true}) username : string | undefined;
  @Input({required:true}) status: string | undefined;
}
