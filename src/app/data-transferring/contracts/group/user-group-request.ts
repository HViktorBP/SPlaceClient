/**
 * UserGroupRequest represents the payload for an API request where only a user's and group's id is needed.
 */
export interface UserGroupRequest {
  userId : number;
  groupId : number;
}
