import {QuizDto} from "../../dtos/quiz/quiz-dto";

/**
 * SubmitQuizRequest represents the payload for an API request to submit the quiz.
 */
export interface SubmitQuizRequest {
  userId: number;
  groupId: number;
  quiz : QuizDto
}
