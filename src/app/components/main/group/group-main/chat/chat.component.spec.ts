import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { UsersService } from '../../../../../services/users.service';
import { GroupDataService } from '../../../../../services/states/group-data.service';
import { MessagesService } from '../../../../../services/messages.service';
import { ApplicationHubService } from '../../../../../services/application-hub.service';
import {Observable, of, Subscription} from 'rxjs';
import { By } from '@angular/platform-browser';
import {MessageDto} from "../../../../../data-transferring/dtos/message/message-dto";

class MockUsersService {
  getUserId() {
    return 1;
  }
}

class MockGroupDataService {
  groupMessagesAsync : Observable<MessageDto[]> = of([
    {
      id: 1,
      groupId: 1,
      userId: 1,
      message: 'Hello World',
      userName: 'User1',
      timestamp: new Date(),
      isEdited: false
    },
    {
      id: 2,
      groupId: 1,
      userId: 2,
      message: 'Hi there!',
      userName: 'User2',
      timestamp: new Date(),
      isEdited: false
    }
  ]);
  groupMessages$ = this.groupMessagesAsync;
  currentGroupId = 1;
}

class MockMessagesService {
  saveMessage(request: any) {
    return of(request);
  }
}

class MockApplicationHubService {
  sendMessage(message: any) {
    return Promise.resolve();
  }
}

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let mockUsersService: MockUsersService;
  let mockGroupDataService: MockGroupDataService;
  let mockMessagesService: MockMessagesService;
  let mockApplicationHubService: MockApplicationHubService;
  let subscriptionToScroll: Subscription;

  beforeEach(waitForAsync(() => {
    mockUsersService = new MockUsersService();
    mockGroupDataService = new MockGroupDataService();
    mockMessagesService = new MockMessagesService();
    mockApplicationHubService = new MockApplicationHubService();

    TestBed.configureTestingModule({
      imports: [
        ChatComponent
      ],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
        { provide: GroupDataService, useValue: mockGroupDataService },
        { provide: MessagesService, useValue: mockMessagesService },
        { provide: ApplicationHubService, useValue: mockApplicationHubService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    subscriptionToScroll = component.subscriptionToScroll = new Subscription();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render messages from groupDataService', waitForAsync(() => {
    fixture.whenStable().then(() => {
      fixture.detectChanges();

      const messages = fixture.debugElement.queryAll(By.css('app-message'));
      expect(messages.length).toBe(2);
    });
  }));

  it('should call sendMessage when enter key is pressed', () => {
    spyOn(component, 'sendMessage');

    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    inputElement.value = 'Test message';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    fixture.detectChanges();
    expect(component.sendMessage).toHaveBeenCalled();
  });

  it('should call saveMessage on sendMessage', waitForAsync(() => {
    spyOn(mockMessagesService, 'saveMessage').and.callThrough();
    component.inputMessage = 'New Test Message';

    component.sendMessage();

    expect(mockMessagesService.saveMessage).toHaveBeenCalledWith({
      userId: 1,
      groupId: 1,
      message: 'New Test Message'
    });
  }));

  it('should clear the input field after sending a message', waitForAsync(() => {
    component.inputMessage = 'Message to send';
    component.sendMessage();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.inputMessage).toBe('');
    });
  }));

  it('should scroll to bottom after sending a message', waitForAsync(() => {
    spyOn(component, 'scrollToBottom');

    component.inputMessage = 'Message to send';
    component.sendMessage();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.scrollToBottom).toHaveBeenCalled();
    });
  }));

  it('should scroll to bottom on groupMessages$ subscription update', waitForAsync(() => {
    spyOn(component, 'scrollToBottom');

    mockGroupDataService.groupMessagesAsync = of([{
      id: 3,
      groupId: 1,
      userId: 3,
      message: 'New message',
      userName: 'User3',
      timestamp: new Date(),
      isEdited: false
    }]);
    component.ngOnInit();

    fixture.whenStable().then(() => {
      expect(component.scrollToBottom).toHaveBeenCalled();
    });
  }));

  afterEach(() => {
    if (subscriptionToScroll) {
      subscriptionToScroll.unsubscribe();
    }
  });
});
