import {Component, inject, Input} from '@angular/core';
import {NgClass, NgOptimizedImage} from "@angular/common";
import {AuthorisationService} from "../../../services/authorisation.service";

@Component({
  selector: 'app-user-menu',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgClass
  ],
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})

export class UserMenuComponent {
  @Input({required:true}) username : string | undefined
  @Input({required:true}) status : string | undefined

  userName = inject(AuthorisationService).getUsername();
}
