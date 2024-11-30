/**
 * DeleteQuizRequest represents the payload for an API request to delete the quiz.
 */
export interface DeleteQuizRequest {
  userId : number;
  groupId : number;
  quizId : number;
}
