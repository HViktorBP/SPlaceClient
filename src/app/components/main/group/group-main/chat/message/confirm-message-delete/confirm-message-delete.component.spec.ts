import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ConfirmMessageDeleteComponent } from './confirm-message-delete.component';
import { MessagesService } from "../../../../../../../services/messages.service";
import { ApplicationHubService } from "../../../../../../../services/application-hub.service";
import { NgToastService } from "ng-angular-popup";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

// Mock Services
class MockMessagesService {
  deleteMessage(request: any) {
    return of({ message: 'Message deleted successfully' });
  }
}

class MockApplicationHubService {
  deleteMessage(groupId: number, messageId: number) {
    return Promise.resolve();
  }
}

class MockNgToastService {
  success(options: any) {}
}

describe('ConfirmMessageDeleteComponent', () => {
  let component: ConfirmMessageDeleteComponent;
  let fixture: ComponentFixture<ConfirmMessageDeleteComponent>;
  let mockMessagesService: MockMessagesService;
  let mockApplicationHubService: MockApplicationHubService;
  let mockToastService: MockNgToastService;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<ConfirmMessageDeleteComponent>>;

  beforeEach(waitForAsync(() => {
    mockMessagesService = new MockMessagesService();
    mockApplicationHubService = new MockApplicationHubService();
    mockToastService = new MockNgToastService();
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    TestBed.configureTestingModule({
      imports: [ConfirmMessageDeleteComponent],
      providers: [
        { provide: MessagesService, useValue: mockMessagesService },
        { provide: ApplicationHubService, useValue: mockApplicationHubService },
        { provide: NgToastService, useValue: mockToastService },
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { id: 1, userId: 1, groupId: 1 } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmMessageDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger change detection to apply template logic
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct dialog title and buttons', () => {
    const dialogTitle: HTMLElement = fixture.debugElement.query(By.css('h2[mat-dialog-title]')).nativeElement;
    expect(dialogTitle.textContent).toContain('Delete message');

    const confirmationText: HTMLElement = fixture.debugElement.query(By.css('mat-dialog-content h2')).nativeElement;
    expect(confirmationText.textContent).toContain('You sure you want to delete the message?');

    const confirmButton: HTMLElement = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(confirmButton.textContent).toContain('Yes');

    const cancelButton: HTMLElement = fixture.debugElement.query(By.css('button[type="button"]')).nativeElement;
    expect(cancelButton.textContent).toContain('Cancel');
  });

  it('should call deleteMessage and close the dialog when confirmed', waitForAsync(() => {
    spyOn(mockMessagesService, 'deleteMessage').and.callThrough();
    spyOn(mockApplicationHubService, 'deleteMessage').and.callThrough();
    spyOn(mockToastService, 'success').and.callThrough();

    const confirmButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    confirmButton.click();

    fixture.whenStable().then(() => {
      expect(mockMessagesService.deleteMessage).toHaveBeenCalledWith({
        userId: 1,
        groupId: 1,
        messageId: 1
      });
      expect(mockApplicationHubService.deleteMessage).toHaveBeenCalledWith(1, 1);
      expect(mockToastService.success).toHaveBeenCalledWith({
        detail: 'Success',
        summary: 'Message deleted successfully',
        duration: 3000
      });
      expect(mockDialogRef.close).toHaveBeenCalled();
    });
  }));

  it('should close the dialog when cancel button is clicked', () => {
    const cancelButton = fixture.debugElement.query(By.css('button[type="button"]')).nativeElement;
    cancelButton.click();

    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
