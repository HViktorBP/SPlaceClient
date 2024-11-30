import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { UserRegistrationRequest } from '../data-transferring/contracts/user/user-registration-request';
import { UserLogInRequest } from '../data-transferring/contracts/user/user-log-in-request';
import { ChangeUsernameRequest } from '../data-transferring/contracts/user/change-username-request';
import { ChangePasswordRequest } from '../data-transferring/contracts/user/change-password-request';
import { UserAccount } from '../data-transferring/dtos/user/user-account';

/**
 * Unit tests for UsersService, which manages user-related operations.
 */
describe('UsersService', () => {
  let service: UsersService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl + 'Users/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService]
    });
    service = TestBed.inject(UsersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a user', () => {
    const mockRequest: UserRegistrationRequest = { username: 'testuser', email: 'test@example.com', password: 'password123' };
    const mockResponse = { message: 'User registered successfully' };

    service.signUp(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should log in a user', () => {
    const mockRequest: UserLogInRequest = { username: 'testuser', password: 'password123' };
    const mockResponse = { token: 'mockToken' };

    service.logIn(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should store user data in session storage', () => {
    const mockToken = 'mockToken';
    spyOn<any, any>(service, 'decodeJwtToken').and.returnValue({ userId: '123', userName: 'testuser' });

    service.storeUserData(mockToken);

    expect(sessionStorage.getItem('userId')).toBe('123');
    expect(sessionStorage.getItem('userName')).toBe('testuser');
    expect(sessionStorage.getItem('token')).toBe(mockToken);
  });

  it('should get user account details', () => {
    const mockUserId = 1;
    const mockResponse: UserAccount = {
      username: 'testuser',
      status: 'active',
      groups: [],
      createdGroups: [],
      createdQuizzes: [],
      scores: []
    };

    service.getUserAccount(mockUserId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}${mockUserId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should throw an error if user ID is not stored', () => {
    sessionStorage.removeItem('userId');
    expect(() => service.getUserId()).toThrowError('No ID stored in localStorage');
  });

  it('should change user username', () => {
    const mockRequest: ChangeUsernameRequest = { userId: 1, newUsername: 'newuser' };
    const mockResponse = { message: 'Username changed successfully' };

    service.changeUsername(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}username`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should change user password', () => {
    const mockRequest: ChangePasswordRequest = { userId: 1, newPassword: 'newpassword123' };
    const mockResponse = { message: 'Password changed successfully' };

    service.changePassword(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}password`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should delete user account', () => {
    spyOn(service, 'getUserId').and.returnValue(1);
    const mockResponse = { message: 'Account deleted successfully' };

    service.deleteAccount().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should check if user is logged in', () => {
    sessionStorage.setItem('token', 'mockToken');
    expect(service.isLoggedIn()).toBeTrue();
    sessionStorage.removeItem('token');
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should log out the user', () => {
    sessionStorage.setItem('token', 'mockToken');
    service.logOut();
    expect(sessionStorage.getItem('token')).toBeNull();
  });
});
