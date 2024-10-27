import {AnswerDto} from "../answer/answer-dto";
import {Question} from "../../enums/question";

export interface QuestionDto {
  id: number;
  question : string,
  type : Question
  answers : AnswerDto[]
}
