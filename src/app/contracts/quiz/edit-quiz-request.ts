import {QuizDto} from "../../dtos/quiz/quiz-dto";

export interface EditQuizRequest {
  userId: number;
  groupId: number;
  quiz : QuizDto
}
