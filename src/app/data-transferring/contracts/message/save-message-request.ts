/**
 * SaveMessageRequest represents the payload for an API request to save the message to database.
 */
export interface SaveMessageRequest {
  userId : number;
  groupId : number;
  message : string
}
