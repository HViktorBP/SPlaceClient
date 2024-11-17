import {TestBed} from '@angular/core/testing';
import { provideHttpClientTesting } from "@angular/common/http/testing";
import {UserDataService} from './user-data.service';
import {UsersService} from '../users.service';
import {GroupsService} from '../groups.service';
import {QuizzesService} from '../quizzes.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('UsersDataService', () => {
  let service: UserDataService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents()
    service = TestBed.inject(UserDataService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

describe('UserDataService subjects testing', () => {
  beforeEach(() => {
    const userServiceMock = jasmine.createSpyObj('UserService', ['getUserID', 'getUserByID', 'getUsername'])
    const groupsServiceMock = jasmine.createSpyObj('GroupsService', ['getGroups', 'getGroupById', 'getUsersInGroup', 'getUserRole'])
    const quizzesServiceMock = jasmine.createSpyObj('QuizzesService', ['getQuizzesInGroup'])

    TestBed.configureTestingModule({
      providers: [
        UserDataService,
        { provide: UsersService, useValue: userServiceMock },
        { provide: GroupsService, useValue: groupsServiceMock },
        { provide: QuizzesService, useValue: quizzesServiceMock }
      ]
    })

  })
})
