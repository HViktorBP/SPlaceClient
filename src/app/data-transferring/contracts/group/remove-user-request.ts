/**
 * RemoveUserRequest represents the payload for an API request to remove a user from group.
 */
export interface RemoveUserRequest {
  userId : number;
  groupId : number;
  userToDeleteName : string;
}
