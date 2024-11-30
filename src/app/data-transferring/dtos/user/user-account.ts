import {GroupIdentifier} from "../group/group-identifier";
import {QuizIdentifier} from "../quiz/quiz-identifier";
import {QuizScores} from "../score/quiz-scores";

/**
 * UserAccount provides an interface for data that is related to user's account.
 */
export interface UserAccount {
  username : string;
  status : string;
  createdGroups : GroupIdentifier[];
  groups : GroupIdentifier[];
  createdQuizzes : QuizIdentifier[];
  scores : QuizScores[];
}
