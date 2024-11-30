import {AnswerDto} from "../answer/answer-dto";
import {Question} from "../../enums/question";

/**
 * QuestionDto provides a data transfer object for question.
 */
export interface QuestionDto {
  id: number;
  question : string,
  type : Question
  answers : AnswerDto[]
}
