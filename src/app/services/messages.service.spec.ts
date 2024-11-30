import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MessagesService } from './messages.service';
import { SaveMessageRequest } from '../data-transferring/contracts/message/save-message-request';
import { MessageDto } from '../data-transferring/dtos/message/message-dto';
import { DeleteMessageRequest } from '../data-transferring/contracts/message/delete-message-request';
import { environment } from '../../environments/environment';

describe('MessagesService', () => {
  let service: MessagesService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl + 'Messages/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MessagesService]
    });
    service = TestBed.inject(MessagesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save a message', () => {
    const saveMessagePayload: SaveMessageRequest = {
      userId: 1,
      groupId: 1,
      message: 'Test message'
    };
    const mockResponse: MessageDto = {
      id: 1,
      userId: 1,
      userName: 'Test User',
      groupId: 1,
      message: 'Test message',
      timestamp: new Date(),
      isEdited: false
    };

    service.saveMessage(saveMessagePayload).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}save`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should edit a message', () => {
    const editMessage: MessageDto = {
      id: 1,
      userId: 1,
      userName: 'Test User',
      groupId: 1,
      message: 'Updated message',
      timestamp: new Date(),
      isEdited: true
    };

    service.editMessage(editMessage).subscribe((response) => {
      expect(response).toEqual(editMessage);
    });

    const req = httpMock.expectOne(`${baseUrl}edit`);
    expect(req.request.method).toBe('PUT');
    req.flush(editMessage);
  });

  it('should delete a message', () => {
    const deleteMessagePayload: DeleteMessageRequest = {
      userId: 1,
      groupId: 1,
      messageId: 1
    };

    service.deleteMessage(deleteMessagePayload).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${baseUrl}delete`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(deleteMessagePayload);
    req.flush({});
  });
});
