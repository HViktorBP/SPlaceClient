import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MainComponent} from './main.component';
import {UsersService} from '../../services/users.service';
import {UserDataService} from '../../services/states/user-data.service';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute} from '@angular/router';
import {of} from 'rxjs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import createSpyObj = jasmine.createSpyObj;

import { NgToastService } from 'ng-angular-popup';
import {CreateGroupComponent} from "./create-group/create-group.component";
import {UserAccount} from "../../data-transferring/dtos/user/user-account";
import {AboutAppComponent} from "./about-app/about-app.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";

let toastSpy: jasmine.SpyObj<NgToastService>;

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let userDataServiceSpy: jasmine.SpyObj<UserDataService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    toastSpy = createSpyObj('NgToastService', ['info', 'error', 'success']);
    usersServiceSpy = createSpyObj('UsersService', ['getUserId', 'getUserAccount', 'getUserName']);
    userDataServiceSpy = createSpyObj('UserDataService', ['updateUsername', 'updateStatus', 'updateGroupData', 'updateCreatedGroupData', 'updateCreatedQuizzesData', 'updateUserScores']);
    dialogSpy = createSpyObj('MatDialog', ['open']);
    activatedRouteSpy = createSpyObj('ActivatedRoute', [], { snapshot: { paramMap: new Map() } });

    await TestBed.configureTestingModule({
      imports: [ MainComponent, BrowserAnimationsModule, HttpClientTestingModule ],
      providers: [
        { provide: NgToastService, useValue: toastSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: UserDataService, useValue: userDataServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    usersServiceSpy.getUserId.and.returnValue(123);
    usersServiceSpy.getUserAccount.and.returnValue(of({ username: 'testUser', status: 'active', groups: [], createdGroups : [], createdQuizzes : [], scores : [] }));
    fixture.detectChanges();
  });

  afterEach(() => {
    usersServiceSpy.getUserAccount.calls.reset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open AboutApp dialog on initialization if not shown before', () => {
    spyOn(sessionStorage, 'getItem').and.returnValue(null);
    spyOn(sessionStorage, 'setItem');

    component.ngOnInit();

    expect(dialogSpy.open).toHaveBeenCalledWith(AboutAppComponent);
    expect(sessionStorage.setItem).toHaveBeenCalledWith('aboutAppPopUpShowed', 'true');
  });

  it('should call getUserAccount and update user data on initialization', () => {
    const mockUser : UserAccount = {
      username: 'testUser',
      status: 'active',
      groups: [{ id: 1, name : 'group1' }],
      createdGroups: [],
      createdQuizzes: [],
      scores: []
    };

    usersServiceSpy.getUserId.and.returnValue(123);
    usersServiceSpy.getUserAccount.and.returnValue(of(mockUser));

    component.ngOnInit();

    expect(usersServiceSpy.getUserAccount).toHaveBeenCalledWith(123);
    expect(userDataServiceSpy.updateUsername).toHaveBeenCalledWith('testUser');
    expect(userDataServiceSpy.updateStatus).toHaveBeenCalledWith('active');
    expect(userDataServiceSpy.updateGroupData).toHaveBeenCalledWith(mockUser.groups);
    expect(userDataServiceSpy.updateCreatedGroupData).toHaveBeenCalledWith(mockUser.createdGroups);
    expect(userDataServiceSpy.updateCreatedQuizzesData).toHaveBeenCalledWith(mockUser.createdQuizzes);
    expect(userDataServiceSpy.updateUserScores).toHaveBeenCalledWith(mockUser.scores);
  });

  it('should open CreateGroup dialog when onCreateNewGroup is called', () => {
    component.onCreateNewGroup();
    expect(dialogSpy.open).toHaveBeenCalledWith(CreateGroupComponent);
  });
});
