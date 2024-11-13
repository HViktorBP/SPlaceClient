/**
 * RenameGroupRequest represents the payload for an API request to rename a group.
 */
export interface RenameGroupRequest {
  userId : number;
  groupId : number;
  newGroupName : string
}
