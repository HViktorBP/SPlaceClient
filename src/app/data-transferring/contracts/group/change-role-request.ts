/**
 * ChangeRoleRequest represents the payload for an API request to change a user's role in a group.
 */
export interface ChangeRoleRequest {
  userId : number;
  groupId : number;
  userName : string;
  role : number
}
