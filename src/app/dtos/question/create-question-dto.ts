import {CreateAnswerDto} from "../answer/create-answer-dto";

export interface CreateQuestionDto {
  question: string;
  type: string;
  answers : CreateAnswerDto[]
}
