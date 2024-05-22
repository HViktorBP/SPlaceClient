import { TestBed } from '@angular/core/testing';

import { GroupsService } from './groups.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('GroupsService', () => {
  let service: GroupsService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    }).compileComponents()
    service = TestBed.inject(GroupsService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})

describe('Http testing GroupsService', () => {
  let service: GroupsService
  let httpMock: HttpTestingController

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GroupsService]
    })

    service = TestBed.inject(GroupsService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify() // Verify that no unmatched requests are outstanding
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should retrieve groups for a user', () => {
    const mockGroups = [1, 2, 3]

    service.getGroups(1).subscribe(groups => {
      expect(groups).toEqual(mockGroups)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}groups?userID=1`)
    expect(req.request.method).toBe('GET')
    req.flush(mockGroups)
  })

  it('should retrieve group by ID', () => {
    const mockGroupName = 'Test Group'

    service.getGroupById(1).subscribe(groupName => {
      expect(groupName).toBe(mockGroupName)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}group-by-id?groupID=1`)
    expect(req.request.method).toBe('GET')
    req.flush(mockGroupName)
  })

  it('should retrieve group creator by group ID', () => {
    const mockCreatorId = 1

    service.getGroupCreator(1).subscribe(creatorId => {
      expect(creatorId).toBe(mockCreatorId)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}group-creator?groupID=1`)
    expect(req.request.method).toBe('GET')
    req.flush(mockCreatorId)
  })

  it('should retrieve users in a group', () => {
    const mockUsers = [1, 2, 3]

    service.getUsersInGroup(1).subscribe(users => {
      expect(users).toEqual(mockUsers)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}users-in-group?groupID=1`)
    expect(req.request.method).toBe('GET')
    req.flush(mockUsers)
  })

  it('should retrieve user role in a group', () => {
    const mockRole = 'admin'

    service.getUserRole(1, 1).subscribe(role => {
      expect(role).toBe(mockRole)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}user-role?userID=1&groupID=1`)
    expect(req.request.method).toBe('GET')
    req.flush(mockRole)
  })

  it('should add a new group', () => {
    const mockResponse = { message: 'Group added successfully' }
    const groupName = 'New Group'

    service.addGroup(1, groupName).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}add-group`)
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual({ userId: 1, groupName })
    req.flush(mockResponse)
  })

  it('should add a user to a group', () => {
    const mockResponse = { message: 'User added successfully' }
    const usersGroup = { userId: 1, groupId: 1, role: 'member' }

    service.addUserInGroup(usersGroup.userId, usersGroup.groupId, usersGroup.role).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}add-user-in-group`)
    expect(req.request.method).toBe('POST')
    expect(req.request.body).toEqual(usersGroup)
    req.flush(mockResponse)
  })

  it('should delete a user from a group', () => {
    const mockResponse = { message: 'User deleted successfully' }
    const userId = 1, groupId = 1, role = 'member', currentUserRole = 'admin'

    service.deleteUserFromGroup(userId, groupId, role, currentUserRole).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}delete-user-from-group?role=${currentUserRole}`)
    expect(req.request.method).toBe('DELETE')
    expect(req.request.body).toEqual({ userId, groupId, role })
    req.flush(mockResponse)
  })

  it('should leave a group', () => {
    const mockResponse = { message: 'Left group successfully' }

    service.leaveGroup(1, 1).subscribe(response => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${service['baseUrl']}leave-group?userID=1&groupID=1`)
    expect(req.request.method).toBe('DELETE')
    req.flush(mockResponse)
  })
})
