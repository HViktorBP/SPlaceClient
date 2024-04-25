import {AfterViewChecked, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {ChatService} from "../../../services/chat.service";
import {FormsModule} from "@angular/forms";
import {GroupComponent} from "../group.component";
import {AuthorisationService} from "../../../services/authorisation.service";
import {forkJoin, of, switchMap, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";

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
  inputMessage= ''
  loggedInUserName!:string
  auth = inject(AuthorisationService)
  @ViewChild('scrollMe') private scrollContainer!: ElementRef
  private canBeScrolled = false

  constructor(private route : ActivatedRoute) {

  }

  ngOnInit () {
    this.groupData.messages$.subscribe(() => {
      try {
        console.log('Messages uploaded')
        this.canBeScrolled = !this.canBeScrolled
      } catch (e) {
        console.log(e)
      }
    })
    this.loggedInUserName = this.auth.getUsername()
  }

  ngAfterViewChecked() {
    if (this.canBeScrolled) {
      console.log("Now")
      this.canBeScrolled = !this.canBeScrolled
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight
    }
  }

  sendMessage() {
    const date = new Date();
    const groupID = this.route.snapshot.paramMap.get('id')!

    this.auth.getUserID(this.auth.getUsername()).pipe(
      switchMap(res => {
        return this.chatService.saveMessage(res, +groupID, this.inputMessage, date).pipe(
          switchMap(() => {
            return forkJoin({
              sendMessageResult: this.groupData.sendMessage(this.inputMessage, groupID, date),
              clearInputResult: of(this.inputMessage = '')
            })
          }),
          tap(() => console.log('Message sent successfully'))
        )
      })
    ).subscribe({
      error: (error) => {
        console.error('Error:', error)
      },
    })
  }
}
