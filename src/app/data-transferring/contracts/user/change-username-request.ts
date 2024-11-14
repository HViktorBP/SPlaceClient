/**
 * ChangeUsernameRequest represents the payload for an API request to change user's username.
 */
export interface ChangeUsernameRequest {
  userId : number;
  newUsername : string;
}
