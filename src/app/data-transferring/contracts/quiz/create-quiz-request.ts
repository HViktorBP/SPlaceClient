import {CreateQuizDto} from "../../dtos/quiz/create-quiz-dto";

export interface CreateQuizRequest {
  userId : number;
  groupId : number;
  quiz : CreateQuizDto
}
