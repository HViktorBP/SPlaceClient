import {Component} from '@angular/core';
import {Quote} from "../../../interfaces/quote";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent {
  quote: Quote = {
    quoteText : '',
    quoteAuthor : ''
  }

  constructor(private auth : UserService) {
    this.auth.getQuote().subscribe(data => {
      this.quote = data
    });
  }
}
