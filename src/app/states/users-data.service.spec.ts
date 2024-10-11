import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {UsersDataService} from './users-data.service';
import {UsersService} from '../services/users.service';
import {GroupsService} from '../services/groups.service';
import {QuizzesService} from '../services/quizzes.service';

describe('UsersDataService', () => {
  let service: UsersDataService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }).compileComponents()
    service = TestBed.inject(UsersDataService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

describe('UsersDataService subjects testing', () => {
  beforeEach(() => {
    const userServiceMock = jasmine.createSpyObj('UserService', ['getUserID', 'getUserByID', 'getUsername'])
    const groupsServiceMock = jasmine.createSpyObj('GroupsService', ['getGroups', 'getGroupById', 'getUsersInGroup', 'getUserRole'])
    const quizzesServiceMock = jasmine.createSpyObj('QuizzesService', ['getQuizzesInGroup'])

    TestBed.configureTestingModule({
      providers: [
        UsersDataService,
        { provide: UsersService, useValue: userServiceMock },
        { provide: GroupsService, useValue: groupsServiceMock },
        { provide: QuizzesService, useValue: quizzesServiceMock }
      ]
    })

  })
})
