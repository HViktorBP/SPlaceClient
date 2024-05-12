import {AfterViewChecked, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {GroupHubService} from "../../../services/group-hub.service";
import {FormsModule} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {forkJoin, of, switchMap, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {UsersDataService} from "../../../services/users-data.service";

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
  groupHubService = inject(GroupHubService)
  userData = inject(UsersDataService)
  inputMessage= ''
  loggedInUserName!:string
  auth = inject(UserService)
  @ViewChild('scrollMe') private scrollContainer!: ElementRef
  private canBeScrolled = false

  constructor(private route : ActivatedRoute) {

  }

  ngOnInit () {
    this.userData.groupMessages$.subscribe(() => {
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
      this.canBeScrolled = !this.canBeScrolled
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight
    }
  }

  sendMessage() {
    const date = new Date();
    const groupID = this.route.snapshot.paramMap.get('id')!

    this.auth.getUserID(this.auth.getUsername()).pipe(
      switchMap(res => {
        return this.groupHubService.saveMessage(res, +groupID, this.inputMessage, date).pipe(
          switchMap(() => {
            return forkJoin({
              sendMessageResult: this.groupHubService.sendMessage(this.inputMessage, groupID, date),
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
