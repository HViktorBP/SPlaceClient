import {QuizIdentifier} from "../quiz/quiz-identifier";
import {MessageDto} from "../message/message-dto";

export interface GroupDto {
  name : string;
  users : string[];
  quizzes : QuizIdentifier[];
  messages : MessageDto[];
}
