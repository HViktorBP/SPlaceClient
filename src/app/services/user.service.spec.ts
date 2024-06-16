import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('UserService', () => {
  let service: UserService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }).compileComponents()
    service = TestBed.inject(UserService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

describe('Http testing UserService', () => {
  let service: UserService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    })

    service = TestBed.inject(UserService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should sign up a user', () => {
    const mockResponse = {message: 'User registered successfully'}
    const formData = {username: 'testuser', password: 'testpass', email: 'test@example.com'}

    service.signUp(formData.username, formData.password, formData.email).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}register`)
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual(formData)
    req.flush(mockResponse)
  })

  it('should log in a user', () => {
    const mockResponse = {token: 'test-token'}
    const formData = {username: 'testuser', password: 'testpass'}

    service.logIn(formData.username, formData.password).subscribe(response => {
      expect(response.token).toBe(mockResponse.token)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}authentication`)
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual(formData)
    req.flush(mockResponse)
  })

  it('should store token in session storage', () => {
    const tokenValue = 'test-token'
    spyOn(sessionStorage, 'setItem')

    service.storeToken(tokenValue)
    expect(sessionStorage.setItem).toHaveBeenCalledWith('token', tokenValue)
  })

  it('should store username in session storage', () => {
    const username = 'testuser'
    spyOn(sessionStorage, 'setItem')

    service.storeUsername(username)
    expect(sessionStorage.setItem).toHaveBeenCalledWith('username', username)
  })

  it('should retrieve user by name', () => {
    const mockUser = {username: 'testuser', password: '', email: 'test@example.com', status: "Curious"}

    service.getUserByName('testuser').subscribe(user => {
      expect(user).toEqual(mockUser)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}user-by-name?username=testuser`)
    expect(req.request.method).toBe('GET')
    req.flush(mockUser)
  })

  it('should retrieve user by ID', () => {
    const mockUser = {username: 'testuser', password: '', email: 'test@example.com', status: 'Curious'}
    service.getUserByID(1).subscribe(user => {
      expect(user).toEqual(mockUser)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}user-by-id?id=1`)
    expect(req.request.method).toBe('GET')
    req.flush(mockUser)
  })

  it('should retrieve user ID by username', () => {
    const mockUserID = 1

    service.getUserID('testuser').subscribe(id => {
      expect(id).toBe(mockUserID)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}id?username=testuser`)
    expect(req.request.method).toBe('GET')
    req.flush(mockUserID)
  })

  it('should return username from session storage', () => {
    const username = 'testuser'
    spyOn(sessionStorage, 'getItem').and.returnValue(username)

    const result = service.getUsername()
    expect(result).toBe(username)
  })

  it('should return quote', () => {
    const mockQuote = {quoteText: 'This is a test quote', quoteAuthor: 'Me'}

    service.getQuote().subscribe(quote => {
      expect(quote).toEqual(mockQuote)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}quote`)
    expect(req.request.method).toBe('GET')
    req.flush(mockQuote)
  })

  it('should change username', () => {
    const mockResponse = {message: 'Username changed successfully'}
    const newUsername = 'newuser'
    const userID = 1

    service.changeUsername(newUsername, userID).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}change-username?username=${newUsername}&userID=${userID}`)
    expect(req.request.method).toBe('PUT')
    req.flush(mockResponse)
  })

  it('should change password', () => {
    const mockResponse = {message: 'Password changed successfully'}
    const newPassword = 'newpass'
    const userID = 1

    service.changePassword(newPassword, userID).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}change-password?password=${newPassword}&userID=${userID}`)
    expect(req.request.method).toBe('PUT')
    req.flush(mockResponse)
  })

  it('should change status', () => {
    const mockResponse = {message: 'Status changed successfully'}
    const newStatus = 'active'
    const userID = 1

    service.changeStatus(newStatus, userID).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}change-status?status=${newStatus}&userID=${userID}`)
    expect(req.request.method).toBe('PUT')
    req.flush(mockResponse)
  })

  it('should change email', () => {
    const mockResponse = {message: 'Email changed successfully'}
    const newEmail = 'new@example.com'
    const userID = 1

    service.changeEmail(newEmail, userID).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}change-email?email=${newEmail}&userID=${userID}`)
    expect(req.request.method).toBe('PUT')
    req.flush(mockResponse)
  })

  it('should return logged in true based on token', () => {
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'token') {
        return 'test-token'
      }
      return null
    })

    expect(service.isLoggedIn()).toBeTrue()
  })

  it('should return logged in false based on token', () => {
    spyOn(sessionStorage, 'getItem').and.callFake(() => {
      return null
    })

    expect(service.isLoggedIn()).toBeFalse()
  })
})

