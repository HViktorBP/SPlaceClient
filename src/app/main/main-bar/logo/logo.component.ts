import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss'
})
export class LogoComponent {

  constructor(private router : Router) {
  }

  onClick() {
    this.router.navigate(['/main/home']).then(()=> {
      //location.reload()
    })
  }
}
