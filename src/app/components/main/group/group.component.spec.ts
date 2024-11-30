import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { GroupComponent } from './group.component';
import { GroupsService } from '../../../services/groups.service';
import { UsersService } from '../../../services/users.service';
import { GroupDataService } from '../../../services/states/group-data.service';
import { Role } from '../../../data-transferring/enums/role';
import { UserPublicData } from '../../../data-transferring/dtos/user/user-public-data';
import { provideRouter } from '@angular/router';

interface GroupDto {
  name: string;
  users: UserPublicData[];
  quizzes: any[];
  messages: any[];
  scores: any[];
}

class MockGroupsService {
  getGroup(groupId: number) {
    return of<GroupDto>({
      name: 'Test Group',
      users: [{ username: 'test', status: 'curious' }],
      quizzes: [],
      messages: [],
      scores: []
    });
  }

  getRole(userId: number, groupId: number) {
    return of<Role>(Role.Administrator);
  }
}

class MockUsersService {
  getUserId() {
    return 1;
  }
}

class MockGroupDataService {
  updateUserCurrentGroupId(groupId: number) {}
  updateGroupName(name: string) {}
  updateUserCount(count: number) {}
  updateUsersList(users: UserPublicData[]) {}
  updateQuizzesList(quizzes: any[]) {}
  updateGroupMessages(messages: any[]) {}
  updateUserRole(role: Role) {}
  updateGroupScores(scores: any[]) {}
}

describe('GroupComponent', () => {
  let component: GroupComponent;
  let fixture: ComponentFixture<GroupComponent>;
  let mockGroupsService: MockGroupsService;
  let mockUsersService: MockUsersService;
  let mockGroupDataService: MockGroupDataService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupComponent],
      providers: [
        provideRouter([]),
        { provide: GroupsService, useClass: MockGroupsService },
        { provide: UsersService, useClass: MockUsersService },
        { provide: GroupDataService, useClass: MockGroupDataService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ groupId: '1' }),
            snapshot: {
              paramMap: {
                get: (key: string) => '1',
              },
            },
          },
        },
      ],
      teardown: { destroyAfterEach: false }
    }).compileComponents();

    fixture = TestBed.createComponent(GroupComponent);
    component = fixture.componentInstance;
    mockGroupsService = TestBed.inject(GroupsService);
    mockUsersService = TestBed.inject(UsersService);
    mockGroupDataService = TestBed.inject(GroupDataService);
  });

  afterEach(() => {
    if (fixture && fixture.nativeElement && fixture.nativeElement.isConnected) {
      fixture.destroy();
    }
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch group data and update GroupDataService on init', () => {
    spyOn(mockGroupDataService, 'updateUserCurrentGroupId');
    spyOn(mockGroupDataService, 'updateGroupName');
    spyOn(mockGroupDataService, 'updateUserCount');
    spyOn(mockGroupDataService, 'updateUsersList');
    spyOn(mockGroupDataService, 'updateQuizzesList');
    spyOn(mockGroupDataService, 'updateGroupMessages');
    spyOn(mockGroupDataService, 'updateUserRole');
    spyOn(mockGroupDataService, 'updateGroupScores');

    component.ngOnInit();

    expect(mockGroupDataService.updateUserCurrentGroupId).toHaveBeenCalledWith(1);
    expect(mockGroupDataService.updateGroupName).toHaveBeenCalledWith('Test Group');
    expect(mockGroupDataService.updateUserCount).toHaveBeenCalledWith(1);
    expect(mockGroupDataService.updateUsersList).toHaveBeenCalledWith([{ username: 'test', status: 'curious' }]);
    expect(mockGroupDataService.updateQuizzesList).toHaveBeenCalledWith([]);
    expect(mockGroupDataService.updateGroupMessages).toHaveBeenCalledWith([]);
    expect(mockGroupDataService.updateUserRole).toHaveBeenCalledWith(Role.Administrator);
    expect(mockGroupDataService.updateGroupScores).toHaveBeenCalledWith([]);
  });

  it('should unsubscribe from routeSubscription on destroy', () => {
    component.ngOnInit();

    component.routeSubscription = new Subscription();

    const unsubscribeSpy = spyOn(component.routeSubscription, 'unsubscribe');

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
