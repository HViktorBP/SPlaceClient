import {QuizIdentifier} from "../quiz/quiz-identifier";
import {MessageDto} from "../message/message-dto";
import {UserScore} from "../score/user-score";

export interface GroupDto {
  name : string;
  users : string[];
  quizzes : QuizIdentifier[];
  messages : MessageDto[];
  scores : UserScore[];
}
