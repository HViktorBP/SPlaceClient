import {QuizIdentifier} from "../quiz/quiz-identifier";
import {MessageDto} from "../message/message-dto";
import {QuizScores} from "../score/quiz-scores";
import {UserPublicData} from "../user/user-public-data";

export interface GroupDto {
  name : string;
  users : UserPublicData[];
  quizzes : QuizIdentifier[];
  messages : MessageDto[];
  scores : QuizScores[];
}
