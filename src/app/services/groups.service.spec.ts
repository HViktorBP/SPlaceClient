import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { GroupsService } from './groups.service';
import { GroupDto } from '../data-transferring/dtos/group/group-dto';
import { Role } from '../data-transferring/enums/role';
import { ChangeRoleRequest } from '../data-transferring/contracts/group/change-role-request';
import { CreateGroupRequest } from '../data-transferring/contracts/group/create-group-request';
import { AddUserRequest } from '../data-transferring/contracts/group/add-user-request';
import { RenameGroupRequest } from '../data-transferring/contracts/group/rename-group-request';
import { UserGroupRequest } from '../data-transferring/contracts/group/user-group-request';
import { RemoveUserRequest } from '../data-transferring/contracts/group/remove-user-request';
import { environment } from '../../environments/environment';

describe('GroupsService', () => {
  let service: GroupsService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.apiUrl + 'Groups/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GroupsService]
    });
    service = TestBed.inject(GroupsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get group data', () => {
    const mockGroup: GroupDto = {
      messages: [], quizzes: [], scores: [],
      name: 'Test Group',
      users: []
    };

    service.getGroup(1).subscribe((response) => {
      expect(response).toEqual(mockGroup);
    });

    const req = httpMock.expectOne(`${baseUrl}1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockGroup);
  });

  it('should get user role in group', () => {
    const userId = 1;
    const groupId = 1;
    const mockRole: Role = Role.Participant;

    service.getRole(userId, groupId).subscribe((response) => {
      expect(response).toEqual(mockRole);
    });

    const req = httpMock.expectOne(`${baseUrl}role?userId=${userId}&groupId=${groupId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRole);
  });

  it('should change user role in group', () => {
    const changeRolePayload: ChangeRoleRequest = {
      userId: 1,
      groupId: 1,
      userName: 'Test User',
      role: Role.Creator
    };

    service.changeRole(changeRolePayload).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${baseUrl}role`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(changeRolePayload);
    req.flush({});
  });

  it('should create a group', () => {
    const createGroupPayload: CreateGroupRequest = {
      userId: 1,
      groupName: 'New Group'
    };

    service.createGroup(createGroupPayload).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${baseUrl}create`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(createGroupPayload);
    req.flush({});
  });

  it('should add a user to the group', () => {
    const addUserPayload: AddUserRequest = {
      userId: 1,
      groupId: 1,
      userToAddName: 'New User',
      role: Role.Creator
    };

    service.addUser(addUserPayload).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${baseUrl}add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(addUserPayload);
    req.flush({});
  });

  it('should rename a group', () => {
    const renameGroupPayload: RenameGroupRequest = {
      userId: 1,
      groupId: 1,
      newGroupName: 'Renamed Group'
    };

    service.renameGroup(renameGroupPayload).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${baseUrl}rename`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(renameGroupPayload);
    req.flush({});
  });

  it('should remove a user from the group', () => {
    const removeUserPayload: RemoveUserRequest = {
      userId: 1,
      groupId: 1,
      userToDeleteName: 'User to Remove'
    };

    service.removeUser(removeUserPayload).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${baseUrl}remove`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(removeUserPayload);
    req.flush({});
  });

  it('should delete a group', () => {
    const deleteGroupPayload: UserGroupRequest = {
      userId: 1,
      groupId: 1
    };

    service.deleteGroup(deleteGroupPayload).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${baseUrl}group`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(deleteGroupPayload);
    req.flush({});
  });

  it('should allow user to leave a group', () => {
    const leaveGroupPayload: UserGroupRequest = {
      userId: 1,
      groupId: 1
    };

    service.leaveGroup(leaveGroupPayload).subscribe((response) => {
      expect(response).toEqual({});
    });

    const req = httpMock.expectOne(`${baseUrl}leave`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(leaveGroupPayload);
    req.flush({});
  });
});
