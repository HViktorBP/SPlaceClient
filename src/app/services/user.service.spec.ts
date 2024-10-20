import {TestBed} from '@angular/core/testing';

import {UsersService} from './users.service';
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
})

