import { TestBed } from '@angular/core/testing';
import { UserDataService } from './user-data.service';
import { GroupIdentifier } from '../../data-transferring/dtos/group/group-identifier';
import { QuizIdentifier } from '../../data-transferring/dtos/quiz/quiz-identifier';
import { QuizScores } from '../../data-transferring/dtos/score/quiz-scores';

describe('UserDataService', () => {
  let service: UserDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update and retrieve the user name', (done) => {
    const username = 'TestUser';
    service.updateUsername(username);
    service.usernameAsync.subscribe(name => {
      expect(name).toBe(username);
      done();
    });
  });

  it('should update and retrieve the user status', (done) => {
    const status = 'Active';
    service.updateStatus(status);
    service.userStatusAsync.subscribe(userStatus => {
      expect(userStatus).toBe(status);
      done();
    });
  });

  it('should update and retrieve the user group data', (done) => {
    const groups: GroupIdentifier[] = [
      { id: 1, name: 'Group1' },
      { id: 2, name: 'Group2' }
    ];
    service.updateGroupData(groups);
    service.userGroupsAsync.subscribe(userGroups => {
      expect(userGroups).toEqual(groups);
      done();
    });
  });

  it('should update and retrieve the user created group data', (done) => {
    const createdGroups: GroupIdentifier[] = [
      { id: 3, name: 'CreatedGroup1' },
      { id: 4, name: 'CreatedGroup2' }
    ];
    service.updateCreatedGroupData(createdGroups);
    service.createdGroupsAsync.subscribe(userCreatedGroups => {
      expect(userCreatedGroups).toEqual(createdGroups);
      done();
    });
  });

  it('should update and retrieve the user created quizzes', (done) => {
    const createdQuizzes: QuizIdentifier[] = [
      { id: 1, groupId: 1, name: 'Quiz1' },
      { id: 2, groupId: 1, name: 'Quiz2' }
    ];
    service.updateCreatedQuizzesData(createdQuizzes);
    service.createdQuizzesAsync.subscribe(userCreatedQuizzes => {
      expect(userCreatedQuizzes).toEqual(createdQuizzes);
      done();
    });
  });

  it('should update and retrieve the user scores', (done) => {
    const scores: QuizScores[] = [
      { quizName: 'Quiz1', scores: [{ username: 'test 1', score: 8.0 }] },
      { quizName: 'Quiz2', scores: [{ username: 'test 2', score: 9.0 }] }
    ];
    service.updateUserScores(scores);
    service.userScoresAsync.subscribe(userScores => {
      expect(userScores).toEqual(scores);
      done();
    });
  });

  it('should provide the current list of user groups', () => {
    const groups: GroupIdentifier[] = [
      { id: 1, name: 'Group1' },
      { id: 2, name: 'Group2' }
    ];
    service.updateGroupData(groups);
    expect(service.userGroups).toEqual(groups);
  });

  it('should provide the current list of created groups', () => {
    const createdGroups: GroupIdentifier[] = [
      { id: 3, name: 'CreatedGroup1' },
      { id: 4, name: 'CreatedGroup2' }
    ];
    service.updateCreatedGroupData(createdGroups);
    expect(service.createdGroups).toEqual(createdGroups);
  });

  it('should provide the current list of created quizzes', () => {
    const createdQuizzes: QuizIdentifier[] = [
      { id: 1, groupId: 1, name: 'Quiz1' },
      { id: 2, groupId: 1, name: 'Quiz2' }
    ];
    service.updateCreatedQuizzesData(createdQuizzes);
    expect(service.createdQuizzes).toEqual(createdQuizzes);
  });
});
