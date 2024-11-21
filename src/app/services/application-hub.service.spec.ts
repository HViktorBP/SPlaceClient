// import { TestBed } from '@angular/core/testing';
// import { ApplicationHubService } from './application-hub.service';
// import * as signalR from '@microsoft/signalr';
// import { GroupDataService } from './states/group-data.service';
// import { UserDataService } from './states/user-data.service';
// import { UsersService } from './users.service';
// import { GroupsService } from './groups.service';
// import { NgToastService } from 'ng-angular-popup';
// import { Router } from '@angular/router';
// import { environment } from '../../environments/environment';
// import { MessageDto } from '../data-transferring/dtos/message/message-dto';
//
// describe('ApplicationHubService', () => {
//   let service: ApplicationHubService;
//   let mockGroupDataService: jasmine.SpyObj<GroupDataService>;
//   let mockUserDataService: jasmine.SpyObj<UserDataService>;
//   let mockUsersService: jasmine.SpyObj<UsersService>;
//   let mockGroupsService: jasmine.SpyObj<GroupsService>;
//   let mockToast: jasmine.SpyObj<NgToastService>;
//   let mockRouter: jasmine.SpyObj<Router>;
//   let connectionSpy: jasmine.SpyObj<signalR.HubConnection>;
//
//   beforeEach(() => {
//     const groupDataServiceSpy = jasmine.createSpyObj('GroupDataService', ['updateGroupMessages', 'updateMessage', 'deleteMessage', 'updateUsersList', 'updateUserCount', 'updateGroupScores', 'updateUserRole', 'updateQuizzesList', 'updateGroupName']);
//     const userDataServiceSpy = jasmine.createSpyObj('UserDataService', ['updateGroupData', 'updateUserScores', 'updateCreatedQuizzesData']);
//     const usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUserAccount', 'getUserId']);
//     const groupsServiceSpy = jasmine.createSpyObj('GroupsService', ['getGroup', 'getRole']);
//     const toastSpy = jasmine.createSpyObj('NgToastService', ['success', 'info', 'warning', 'error']);
//     const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
//     const hubConnectionSpy = jasmine.createSpyObj('HubConnection', ['start', 'stop', 'invoke', 'on']);
//
//     TestBed.configureTestingModule({
//       providers: [
//         ApplicationHubService,
//         { provide: GroupDataService, useValue: groupDataServiceSpy },
//         { provide: UserDataService, useValue: userDataServiceSpy },
//         { provide: UsersService, useValue: usersServiceSpy },
//         { provide: GroupsService, useValue: groupsServiceSpy },
//         { provide: NgToastService, useValue: toastSpy },
//         { provide: Router, useValue: routerSpy },
//         { provide: signalR.HubConnection, useValue: hubConnectionSpy },
//       ]
//     });
//
//     service = TestBed.inject(ApplicationHubService);
//     mockGroupDataService = TestBed.inject(GroupDataService) as jasmine.SpyObj<GroupDataService>;
//     mockUserDataService = TestBed.inject(UserDataService) as jasmine.SpyObj<UserDataService>;
//     mockUsersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
//     mockGroupsService = TestBed.inject(GroupsService) as jasmine.SpyObj<GroupsService>;
//     mockToast = TestBed.inject(NgToastService) as jasmine.SpyObj<NgToastService>;
//     mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
//     connectionSpy = TestBed.inject(signalR.HubConnection) as jasmine.SpyObj<signalR.HubConnection>;
//   });
//
//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });
//
//   it('should start connection', async () => {
//     connectionSpy.start.and.returnValue(Promise.resolve());
//     await service.start();
//     expect(connectionSpy.start).toHaveBeenCalled();
//   });
//
//   it('should stop connection', async () => {
//     connectionSpy.stop.and.returnValue(Promise.resolve());
//     await service.leave();
//     expect(connectionSpy.stop).toHaveBeenCalled();
//   });
//
//   it('should invoke SetGroupConnection if connected', async () => {
//     Object.defineProperty(connectionSpy, 'state', { value: signalR.HubConnectionState.Connected, writable: true });
//     connectionSpy.invoke.and.returnValue(Promise.resolve());
//     const groupId = 1;
//     if (connectionSpy.state === signalR.HubConnectionState.Connected) {
//       await service.setGroupConnection(groupId);
//     }
//     expect(connectionSpy.invoke).toHaveBeenCalledWith('SetGroupConnection', groupId);
//   });
//
//   it('should invoke AddUserConnection if connected', async () => {
//     Object.defineProperty(connectionSpy, 'state', { value: signalR.HubConnectionState.Connected, writable: true });
//     connectionSpy.invoke.and.returnValue(Promise.resolve());
//     const username = 'testUser';
//     if (connectionSpy.state === signalR.HubConnectionState.Connected) {
//       await service.addUserConnection(username);
//     }
//     expect(connectionSpy.invoke).toHaveBeenCalledWith('AddUserConnection', username);
//   });
//
//   it('should invoke SendMessage if connected', async () => {
//     Object.defineProperty(connectionSpy, 'state', { value: signalR.HubConnectionState.Connected, writable: true });
//     connectionSpy.invoke.and.returnValue(Promise.resolve());
//     const message: MessageDto = {
//       id: 1,
//       userId: 1,
//       userName: 'Test User',
//       groupId: 1,
//       message: 'Hello World',
//       timestamp: new Date(),
//       isEdited: false
//     };
//     if (connectionSpy.state === signalR.HubConnectionState.Connected) {
//       await service.sendMessage(message);
//     }
//     expect(connectionSpy.invoke).toHaveBeenCalledWith('SendMessage', message);
//   });
//
//   it('should invoke EditMessage if connected', async () => {
//     Object.defineProperty(connectionSpy, 'state', { value: signalR.HubConnectionState.Connected, writable: true });
//     connectionSpy.invoke.and.returnValue(Promise.resolve());
//     const message: MessageDto = {
//       id: 1,
//       userId: 1,
//       userName: 'Test User',
//       groupId: 1,
//       message: 'Edited Message',
//       timestamp: new Date(),
//       isEdited: true
//     };
//     if (connectionSpy.state === signalR.HubConnectionState.Connected) {
//       await service.editMessage(message);
//     }
//     expect(connectionSpy.invoke).toHaveBeenCalledWith('EditMessage', message);
//   });
//
//   it('should invoke DeleteMessage if connected', async () => {
//     Object.defineProperty(connectionSpy, 'state', { value: signalR.HubConnectionState.Connected, writable: true });
//     connectionSpy.invoke.and.returnValue(Promise.resolve());
//     const groupId = 1;
//     const messageId = 1;
//     if (connectionSpy.state === signalR.HubConnectionState.Connected) {
//       await service.deleteMessage(groupId, messageId);
//     }
//     expect(connectionSpy.invoke).toHaveBeenCalledWith('DeleteMessage', groupId, messageId);
//   });
// });
