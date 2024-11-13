import {QuestionDto} from "../question/question-dto";

/**
 * QuizDto provides a data transfer object for quiz.
 */
export interface QuizDto {
  id: number;
  groupId: number;
  name : string;
  questions : QuestionDto[]
}
