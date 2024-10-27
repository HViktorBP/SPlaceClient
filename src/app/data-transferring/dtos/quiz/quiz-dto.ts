import {QuestionDto} from "../question/question-dto";

export interface QuizDto {
  id: number;
  groupId: number;
  name : string;
  questions : QuestionDto[]
}
