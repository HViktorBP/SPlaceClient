/**
 * ChangeStatusRequest represents the payload for an API request to change user's status.
 */
export interface ChangeStatusRequest {
  userId : number;
  newStatus : string;
}
