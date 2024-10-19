import {QuizDto} from "../../dtos/quiz/quiz-dto";

export interface SubmitQuizRequest {
  userId: number;
  groupId: number;
  quiz : QuizDto
}
