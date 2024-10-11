import {AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {GroupHubService} from "../../../services/group-hub.service";
import {FormsModule} from "@angular/forms";
import {UserService} from "../../../services/user.service";
import {forkJoin, Observable, of, Subscription, switchMap} from "rxjs";
import {ActivatedRoute, RouterOutlet} from "@angular/router";
import {UsersDataService} from "../../../states/users-data.service";
import {NgToastService} from "ng-angular-popup";
import {GroupDataService} from "../../../states/group-data.service";
import {User} from "../../../dtos/user";

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
    NgForOf,
    RouterOutlet
  ],
  templateUrl: './group-main.component.html',
  styleUrl: './group-main.component.scss'
})

export class GroupMainComponent implements OnInit{
  messages$ !: Observable<any>
  messagesSubscription !: Subscription
  inputMessage= ''
  loggedInUserName!: number
  @ViewChild('scrollMe') private scrollContainer!: ElementRef
  private canBeScrolled = false

  constructor(private route : ActivatedRoute,
              private toast : NgToastService,
              private auth : UserService,
              private groupHubService : GroupHubService,
              private userService : UserService,
              public groupDataService : GroupDataService) {

  }

   ngOnInit () {
  //   this.messages$ = this.userDataService.groupMessages$
  //
  //   this.messagesSubscription = this.messages$.subscribe(() => {
  //     try {
  //       this.canBeScrolled = !this.canBeScrolled
  //     } catch (e) {
  //       this.toast.error({detail:"Error", summary: "Error when loading the messages!", duration: 3000})
  //     }
  //   })
  //
  }
  //
  // ngAfterViewChecked() {
  //   if (this.canBeScrolled) {
  //     this.canBeScrolled = !this.canBeScrolled
  //     this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight
  //   }
  // }
  //
  // sendMessage() {
  //   const date = new Date();
  //   const groupID = this.route.snapshot.paramMap.get('id')!
  //   const message = this.inputMessage.trim()
  //
  //   if (message != '') {
  //     this.auth.getUserID(this.auth.getUsername()).pipe(
  //       switchMap(res => {
  //         return this.groupHubService.saveMessage(res, +groupID, this.inputMessage, date).pipe(
  //           switchMap(() => {
  //             return forkJoin({
  //               sendMessageResult: this.groupHubService.sendMessage(this.auth.getUsername(), groupID, this.inputMessage, date),
  //               clearInputResult: of(this.inputMessage = '')
  //             })
  //           })
  //         )
  //       })
  //     ).subscribe({
  //       error: (error) => {
  //         this.toast.error({detail:"Error", summary: error.error.message, duration: 3000})
  //       }
  //     })
  //   } else {
  //     this.toast.info({detail:"Info", summary: "If you want to send message, type it in", duration: 3000})
  //   }
  // }
  //
  // ngOnDestroy() {
  //   this.messagesSubscription.unsubscribe()
  // }
}
