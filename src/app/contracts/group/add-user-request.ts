import {Role} from "../../enums/role";

export interface AddUserRequest {
  userId : number;
  groupId : number;
  userToAddName : string;
  role : Role
}
