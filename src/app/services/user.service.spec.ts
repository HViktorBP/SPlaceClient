import { TestBed } from '@angular/core/testing';

import { UsersService } from './users.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('UserService', () => {
  let service: UsersService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }).compileComponents()
    service = TestBed.inject(UsersService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

describe('Http testing UsersService', () => {
  let service: UsersService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsersService]
    })

    service = TestBed.inject(UsersService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should sign up a user', () => {
    const mockResponse = {message: 'User registered successfully'}
    const formData = {username: 'testuser', password: 'testpass'}

    service.signUp(formData).subscribe(response => {
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

    service.logIn(formData.username).subscribe(response => {
      expect(response.token).toBe(mockResponse.token)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}authentication`)
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual(formData)
    req.flush(mockResponse)
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

