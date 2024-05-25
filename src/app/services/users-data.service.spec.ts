import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule} from "@angular/common/http/testing";
import { UsersDataService } from './users-data.service';
import { of } from 'rxjs';
import { UserService } from './user.service';
import { GroupsService } from './groups.service';
import { QuizzesService } from './quizzes.service';
import {QuizzesDTO} from "../interfaces/quizzes-dto";

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
  let service: UsersDataService
  let userServiceSpy: jasmine.SpyObj<UserService>
  let groupsServiceSpy: jasmine.SpyObj<GroupsService>
  let quizzesServiceSpy: jasmine.SpyObj<QuizzesService>

  beforeEach(() => {
    const userServiceMock = jasmine.createSpyObj('UserService', ['getUserID', 'getUserByID', 'getUsername'])
    const groupsServiceMock = jasmine.createSpyObj('GroupsService', ['getGroups', 'getGroupById', 'getUsersInGroup', 'getUserRole'])
    const quizzesServiceMock = jasmine.createSpyObj('QuizzesService', ['getQuizzesInGroup'])

    TestBed.configureTestingModule({
      providers: [
        UsersDataService,
        { provide: UserService, useValue: userServiceMock },
        { provide: GroupsService, useValue: groupsServiceMock },
        { provide: QuizzesService, useValue: quizzesServiceMock }
      ]
    })

    service = TestBed.inject(UsersDataService)
    userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>
    groupsServiceSpy = TestBed.inject(GroupsService) as jasmine.SpyObj<GroupsService>
    quizzesServiceSpy = TestBed.inject(QuizzesService) as jasmine.SpyObj<QuizzesService>
  })

  it('should update user count', () => {
    service.updateUserCount(5)
    service.userCount$.subscribe(count => {
      expect(count).toBe(5)
    })
  })

  it('should update users list', () => {
    const users = ['user1', 'user2']
    service.updateUsersList(users)
    service.userList$.subscribe(userList => {
      expect(userList).toEqual(users)
    })
  })

  it('should update group name', () => {
    const groupName = 'Test Group'
    service.updateGroupName(groupName)
    service.groupName$.subscribe(name => {
      expect(name).toBe(groupName)
    })
  })

  it('should update quizzes list', () => {
    const quizzesList: QuizzesDTO[] = [{ name: 'Quiz 1', creatorID: 1, groupID: 1 }]
    service.updateQuizzesList(quizzesList)
    service.quizList$.subscribe(list => {
      expect(list).toEqual(quizzesList)
    })
  })

  it('should update username', () => {
    const username = 'testUser'
    service.updateUsername(username)
    service.userName$.subscribe(name => {
      expect(name).toBe(username)
    })
  })

  it('should update role', () => {
    const role = 'Administrator'
    service.updateUserRole(role)
    service.userRole$.subscribe(r => {
      expect(r).toBe(role)
    })
  })

  it('should update status', () => {
    const status = 'online'
    service.updateStatus(status)
    service.userStatus$.subscribe(s => {
      expect(s).toBe(status)
    })
  })

  it('should update group messages', () => {
    const messages = ['message1', 'message2']
    service.updateGroupMessages(messages)
    service.groupMessages$.subscribe(messagesReceived => {
      expect(messagesReceived).toEqual(messages)
    })
  })

  it('should update group data', () => {
    const groups = [{ name: 'Group 1', id: 1 }, { name: 'Group 2', id: 2 }]
    service.updateGroupData(groups)
    service.userGroupData$.subscribe(data => {
      expect(data).toEqual(groups)
    })
  })

  it('should update groups list', () => {
    const username = 'testUser'
    const userID = 1
    const groupIDs = [1, 2]
    const groupNames = ['Group 1', 'Group 2']

    userServiceSpy.getUserID.and.returnValue(of(userID))
    groupsServiceSpy.getGroups.and.returnValue(of(groupIDs))
    groupsServiceSpy.getGroupById.and.callFake((groupId: number) => {
      return of(groupNames[groupId - 1])
    })

    service.updateGroupsList(username)

    service.userGroupData$.subscribe(data => {
      expect(data).toEqual([
        { id: 1, name: 'Group 1' },
        { id: 2, name: 'Group 2' }
      ])
    })
  })

  it('should update group display', () => {
    const groupId = 1
    const usersID = [1, 2]
    const userNames = ['User1', 'User2']
    const groupName = 'Test Group'
    const userRole = 'Student'
    const quizzesList: QuizzesDTO[] = [{name: 'Quiz 1', groupID: 1, creatorID: 1 }]

    groupsServiceSpy.getUsersInGroup.and.returnValue(of(usersID))
    userServiceSpy.getUserByID.and.callFake((id: number) => {
      return of({ username: userNames[id - 1], email: 'test@gmail.com', status: 'happy' })
    })
    groupsServiceSpy.getGroupById.and.returnValue(of(groupName))
    quizzesServiceSpy.getQuizzesInGroup.and.returnValue(of(quizzesList))
    userServiceSpy.getUsername.and.returnValue('activeUser')
    userServiceSpy.getUserID.and.returnValue(of(usersID[1]))
    groupsServiceSpy.getUserRole.and.returnValue(of(userRole))

    service.updateGroupDisplay(groupId)

    service.userList$.subscribe(users => {
      expect(users).toEqual(userNames)
    })

    service.userCount$.subscribe(count => {
      expect(count).toBe(userNames.length)
    })

    service.userRole$.subscribe(role => {
      expect(role).toBe(userRole)
    })

    service.groupName$.subscribe(name => {
      expect(name).toBe(groupName)
    })

    service.quizList$.subscribe(list => {
      expect(list).toEqual(quizzesList)
    })
  })
})
