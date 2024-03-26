import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

  constructor(private router: Router) { }
  register() {
    // Implement your authentication logic here
    // For simplicity, let's assume authentication is successful
    // and navigate to the main page
    this.router.navigate(['/main']);
  }

  goToLogin() : void {
    this.router.navigate(['/login']);
  }
}
