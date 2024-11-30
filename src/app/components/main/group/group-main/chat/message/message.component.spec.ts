import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MessageComponent } from './message.component';
import { MessagesService } from "../../../../../../services/messages.service";
import { UsersService } from "../../../../../../services/users.service";
import { NgToastService } from "ng-angular-popup";
import { ApplicationHubService } from "../../../../../../services/application-hub.service";
import { of } from 'rxjs';
import { MatDialog } from "@angular/material/dialog";
import { By } from '@angular/platform-browser';
import { ConfirmMessageDeleteComponent } from "./confirm-message-delete/confirm-message-delete.component";

class MockMessagesService {
  editMessage(messageDto: any) {
    return of({ message: 'Message updated successfully' });
  }
}

class MockUsersService {
  getUserId() {
    return 1; // Mocked user ID
  }
}

class MockNgToastService {
  success(options: any) {}
}

class MockApplicationHubService {
  editMessage(messageDto: any) {
    return Promise.resolve();
  }
}

class MockMatDialog {
  open(component: any, config: any) {
    return {
      afterClosed: () => of(true)
    };
  }
}

describe('MessageComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;
  let mockMessagesService: MockMessagesService;
  let mockUsersService: MockUsersService;
  let mockToastService: MockNgToastService;
  let mockApplicationHubService: MockApplicationHubService;
  let mockMatDialog: MockMatDialog;

  beforeEach(waitForAsync(() => {
    mockMessagesService = new MockMessagesService();
    mockUsersService = new MockUsersService();
    mockToastService = new MockNgToastService();
    mockApplicationHubService = new MockApplicationHubService();
    mockMatDialog = new MockMatDialog();

    TestBed.configureTestingModule({
      imports: [MessageComponent],
      providers: [
        { provide: MessagesService, useValue: mockMessagesService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: NgToastService, useValue: mockToastService },
        { provide: ApplicationHubService, useValue: mockApplicationHubService },
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;

    component.id = 1;
    component.userId = 1;
    component.groupId = 1;
    component.userName = 'User1';
    component.message = 'Hello World';
    component.timestamp = new Date();
    component.isEdited = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display message content and sender details', () => {
    const messageSender: HTMLElement = fixture.debugElement.query(By.css('.message-sender')).nativeElement;
    const messageContent: HTMLElement = fixture.debugElement.query(By.css('.message-content p')).nativeElement;

    expect(messageSender.textContent).toContain('User1');
    expect(messageContent.textContent).toContain('Hello World');
  });

  it('should enable edit mode when edit button is clicked', () => {
    spyOn(component, 'showEdit').and.callThrough();

    const editButton = fixture.debugElement.query(By.css('.edit-button')).nativeElement;
    editButton.click();

    fixture.detectChanges();

    expect(component.showEdit).toHaveBeenCalled();
    expect(component.isEditing).toBeTrue();
    expect(component.editableMessage).toBe('Hello World');
  });

  it('should cancel edit when cancel button is clicked', () => {
    component.showEdit(); // Enable edit mode
    fixture.detectChanges();

    spyOn(component, 'cancelEdit').and.callThrough();

    const cancelButton = fixture.debugElement.query(By.css('.cancel-button')).nativeElement;
    cancelButton.click();

    fixture.detectChanges();

    expect(component.cancelEdit).toHaveBeenCalled();
    expect(component.isEditing).toBeFalse();
  });

  it('should call editMessage on saving the edited message', waitForAsync(() => {
    spyOn(mockMessagesService, 'editMessage').and.callThrough();
    spyOn(mockApplicationHubService, 'editMessage').and.callThrough();
    spyOn(mockToastService, 'success').and.callThrough();

    component.showEdit();
    component.editableMessage = 'Updated Message';
    fixture.detectChanges();

    const saveButton = fixture.debugElement.query(By.css('.edit-button')).nativeElement;
    saveButton.click();

    fixture.whenStable().then(() => {
      fixture.detectChanges();

      expect(mockMessagesService.editMessage).toHaveBeenCalled();
      expect(mockApplicationHubService.editMessage).toHaveBeenCalled();
      expect(mockToastService.success).toHaveBeenCalledWith({
        detail: 'Success',
        summary: 'Message updated successfully',
        duration: 3000
      });
    });
  }));

  it('should open delete confirmation dialog when delete button is clicked', () => {
    spyOn(mockMatDialog, 'open').and.callThrough();

    const deleteButton = fixture.debugElement.query(By.css('.delete-button')).nativeElement;
    deleteButton.click();

    fixture.detectChanges();

    expect(mockMatDialog.open).toHaveBeenCalledWith(ConfirmMessageDeleteComponent, {
      data: {
        id: component.id,
        userId: component.userId,
        groupId: component.groupId
      }
    });
  });
});
