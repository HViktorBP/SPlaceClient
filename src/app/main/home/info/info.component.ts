import {Component, OnInit} from '@angular/core';
import {Quote} from "../../../interfaces/quote";
import {AuthorisationService} from "../../../services/authorisation.service";

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [],
  templateUrl: './info.component.html',
  styleUrl: './info.component.css'
})
export class InfoComponent {
  quote: Quote = {
    quoteText : '',
    quoteAuthor : ''
  }

  constructor(private auth : AuthorisationService) {
    this.auth.getQuote().subscribe(data => {
      this.quote = data
    });
  }
}
