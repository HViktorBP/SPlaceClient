import {AfterViewChecked, Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ChatService} from "../../../services/chat.service";
import {FormsModule} from "@angular/forms";
import {GroupComponent} from "../group.component";
import {AuthorisationService} from "../../../services/authorisation.service";

@Component({
  selector: 'app-group-main',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FormsModule,
    AsyncPipe,
    NgClass,
    DatePipe,
    NgIf,
    NgForOf
  ],
  templateUrl: './group-main.component.html',
  styleUrl: './group-main.component.css'
})

export class GroupMainComponent implements OnInit, AfterViewChecked {
  chatService = inject(ChatService)
  groupData = inject(GroupComponent)
  messages! : string[]
  inputMessage= ''
  loggedInUserName!:string;
  @ViewChild('scrollMe') private scrollContainer!: ElementRef

  constructor(private auth : AuthorisationService) {
  }

  ngOnInit () {
    this.chatService.messages$.subscribe(res => {
      this.messages = res
    })

    this.loggedInUserName = this.auth.getUsername()
  }

  ngAfterViewChecked() {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }

  sendMessage() {
      this.chatService.sendMessage(this.inputMessage).then(()=> {
        try {
          this.inputMessage = ''
        } catch (e) {
          console.log(e)
        }
        console.log(this.messages)
      })
    }
}
