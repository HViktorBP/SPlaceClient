import {GroupIdentifier} from "../group/group-identifier";
import {QuizIdentifier} from "../quiz/quiz-identifier";
import {UserScore} from "../score/user-score";

export interface UserAccount {
  username : string;
  status : string;
  createdGroups : GroupIdentifier[];
  groups : GroupIdentifier[];
  createdQuizzes : QuizIdentifier[];
  scores : UserScore[];
}
