import {Role} from "../../enums/role";

export interface AddUser {
  userId : number;
  groupId : number;
  userToAddName : string;
  role : Role
}
