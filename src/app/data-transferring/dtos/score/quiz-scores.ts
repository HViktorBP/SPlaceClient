import {UserScore} from "./user-score";

/**
 * QuizScores provides an interface for scores related to the quiz.
 */
export interface QuizScores {
  quizName: string,
  scores : UserScore[],
}
