import {Component, OnDestroy, OnInit} from '@angular/core';
import {Quote} from "../../../interfaces/quote";
import {UserService} from "../../../services/user.service";
import {Subscription} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-info',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})

export class InfoComponent implements OnInit, OnDestroy {
  quoteSubscription !: Subscription
  quote !: Quote

  constructor(private auth : UserService) {

  }

  ngOnInit() {
    this.quoteSubscription = this.auth.getQuote().subscribe(quote => {
      this.quote = quote
    })
  }

  ngOnDestroy() {
    this.quoteSubscription.unsubscribe()
  }
}
