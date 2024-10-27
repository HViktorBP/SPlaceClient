import {UserScore} from "./user-score";

export interface QuizScores {
  quizName: string,
  scores : UserScore[],
}
