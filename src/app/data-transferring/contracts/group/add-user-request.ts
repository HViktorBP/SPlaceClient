import {Role} from "../../enums/role";

/**
 * AddUserRequest represents the payload for an API request to add a new user to a group.
 */
export interface AddUserRequest {
  userId : number;
  groupId : number;
  userToAddName : string;
  role : Role
}
