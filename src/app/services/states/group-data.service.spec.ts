import { TestBed } from '@angular/core/testing';
import { GroupDataService } from './group-data.service';
import { Role } from '../../data-transferring/enums/role';
import { UserPublicData } from '../../data-transferring/dtos/user/user-public-data';
import { QuizIdentifier } from '../../data-transferring/dtos/quiz/quiz-identifier';
import { MessageDto } from '../../data-transferring/dtos/message/message-dto';
import { QuizScores } from '../../data-transferring/dtos/score/quiz-scores';

describe('GroupDataService', () => {
  let service: GroupDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update and retrieve the user count', (done) => {
    service.updateUserCount(5);
    service.userCountAsync.subscribe(count => {
      expect(count).toBe(5);
      done();
    });
  });

  it('should update and retrieve the user list', (done) => {
    const users: UserPublicData[] = [
      { username: 'User1', status: 'hey' },
      { username: 'User2', status: 'wassup' }
    ];
    service.updateUsersList(users);
    service.userListAsync.subscribe(userList => {
      expect(userList).toEqual(users);
      done();
    });
  });

  it('should update and retrieve the group name', (done) => {
    service.updateGroupName('Test Group');
    service.groupNameAsync.subscribe(groupName => {
      expect(groupName).toBe('Test Group');
      done();
    });
  });

  it('should update and retrieve the quizzes list', (done) => {
    const quizzes: QuizIdentifier[] = [
      { id: 1, groupId: 1, name: 'Quiz 1' },
      { id: 2, groupId: 1, name: 'Quiz 2' }
    ];
    service.updateQuizzesList(quizzes);
    service.quizzesListAsync.subscribe(quizList => {
      expect(quizList).toEqual(quizzes);
      done();
    });
  });

  it('should update and retrieve the group messages', (done) => {
    const messages: MessageDto[] = [
      { id: 1, userId: 1, userName: 'User1', groupId: 1, message: 'Hello', timestamp: new Date(), isEdited: false },
      { id: 2, userId: 2, userName: 'User2', groupId: 1, message: 'Hi', timestamp: new Date(), isEdited: false }
    ];
    service.updateGroupMessages(messages);
    service.groupMessagesAsync.subscribe(groupMessages => {
      expect(groupMessages).toEqual(messages);
      done();
    });
  });

  it('should update a specific message in the group', (done) => {
    const messages: MessageDto[] = [
      { id: 1, userId: 1, userName: 'User1', groupId: 1, message: 'Hello', timestamp: new Date(), isEdited: false },
      { id: 2, userId: 2, userName: 'User2', groupId: 1, message: 'Hi', timestamp: new Date(), isEdited: false }
    ];
    service.updateGroupMessages(messages);

    const updatedMessage: MessageDto = { id: 1, userId: 1, userName: 'User1', groupId: 1, message: 'Hello Updated', timestamp: new Date(), isEdited: true };
    service.updateMessage(updatedMessage);

    service.groupMessagesAsync.subscribe(groupMessages => {
      expect(groupMessages[0]).toEqual(updatedMessage);
      done();
    });
  });

  it('should delete a specific message in the group', (done) => {
    const messages: MessageDto[] = [
      { id: 1, userId: 1, userName: 'User1', groupId: 1, message: 'Hello', timestamp: new Date(), isEdited: false },
      { id: 2, userId: 2, userName: 'User2', groupId: 1, message: 'Hi', timestamp: new Date(), isEdited: false }
    ];
    service.updateGroupMessages(messages);

    service.deleteMessage(1);

    service.groupMessagesAsync.subscribe(groupMessages => {
      expect(groupMessages.length).toBe(1);
      expect(groupMessages[0].id).toBe(2);
      done();
    });
  });

  it('should update and retrieve the user role', (done) => {
    service.updateUserRole(Role.Administrator);
    service.userRoleAsync.subscribe(role => {
      expect(role).toBe(Role.Administrator);
      done();
    });
  });

  it('should update and retrieve the current group ID', () => {
    service.updateUserCurrentGroupId(10);
    expect(service.currentGroupId).toBe(10);
  });

  it('should update and retrieve the group scores', (done) => {
    const scores: QuizScores[] = [
      { quizName: 'Quiz 1', scores: [{ username: 'test 1', score: 8 }] },
      { quizName: 'Quiz 2', scores: [{ username: 'test 2', score: 9 }] }
    ];
    service.updateGroupScores(scores);
    service.groupScoresAsync.subscribe(groupScores => {
      expect(groupScores).toEqual(scores);
      done();
    });
  });
});
