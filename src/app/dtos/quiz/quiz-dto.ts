import {QuestionDto} from "../question/question-dto";

export interface QuizDto {
  id: string;
  groupId: number;
  name : string;
  questions : QuestionDto[]
}
