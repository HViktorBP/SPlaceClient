import {CreateQuestionDto} from "../question/create-question-dto";

export interface CreateQuizDto {
  name : string;
  questions : CreateQuestionDto[]
}
