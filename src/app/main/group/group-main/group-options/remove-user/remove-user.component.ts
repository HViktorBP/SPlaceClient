import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUserMinus} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-remove-user',
  standalone: true,
    imports: [
        NgOptimizedImage,
        FaIconComponent
    ],
  templateUrl: './remove-user.component.html',
  styleUrl: './remove-user.component.css'
})
export class RemoveUserComponent {
  icon = faUserMinus;
}
