/**
 * ChangePasswordRequest represents the payload for an API request to change user's password.
 */
export interface ChangePasswordRequest {
  userId : number;
  newPassword : string
}
