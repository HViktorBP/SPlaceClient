import {GroupIdentifier} from "../group/group-identifier";
import {QuizIdentifier} from "../quiz/quiz-identifier";
import {QuizScores} from "../score/quiz-scores";

export interface UserAccount {
  username : string;
  status : string;
  createdGroups : GroupIdentifier[];
  groups : GroupIdentifier[];
  createdQuizzes : QuizIdentifier[];
  scores : QuizScores[];
}
