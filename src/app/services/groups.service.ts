import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Group} from "../dtos/group/group";
import {Role} from "../enums/role";
import {ChangeRole} from "../contracts/group/change-role";
import {CreateGroup} from "../contracts/group/create-group";
import {AddUser} from "../contracts/group/add-user";
import {RenameGroup} from "../contracts/group/rename-group";
import {UserGroup} from "../contracts/group/user-group";
import {RemoveUser} from "../contracts/group/remove-user";

@Injectable({
  providedIn: 'root'
})

export class GroupsService {
  private baseUrl = 'https://localhost:7149/api/Groups/';

  constructor(private http : HttpClient) { }

  getGroup(id:number) {
    return this.http.get<Group>(`${this.baseUrl}${id}`)
  }

  getRole(userId : number, groupId : number) {
    return this.http.get<Role>(`${this.baseUrl}role?userId=${userId}&groupId=${groupId}`)
  }

  // getCreator(id:number) {
  //   return this.http.get<number>(`${this.baseUrl}creator`)
  // }

  changeRole(changeRoleRequest : ChangeRole) {
    return this.http.put<string>(`${this.baseUrl}role`, changeRoleRequest)
  }

  createGroup (createGroupRequest : CreateGroup) {
    return this.http.post<string>(`${this.baseUrl}create`, createGroupRequest)
  }

  addUser (addUserRequest : AddUser) {
    return this.http.post<string>(`${this.baseUrl}add`, addUserRequest)
  }

  renameGroup (renameGroupRequest : RenameGroup) {
    return this.http.put<string>(`${this.baseUrl}rename`, renameGroupRequest)
  }

  leaveGroup(leaveGroupRequest : UserGroup) {
    return this.http.delete<string>(`${this.baseUrl}rename`, {"body": leaveGroupRequest})
  }

  removeUser(removeUserRequest : RemoveUser) {
    return this.http.delete<string>(`${this.baseUrl}remove`, {"body" : removeUserRequest})
  }

  deleteGroup(deleteGroupRequest : UserGroup) {
    return this.http.delete<string>(`${this.baseUrl}group`, {"body" : deleteGroupRequest})
  }

  // leaveGroup(userId:number, groupId:number) {
  //   return this.http.delete<any>(`${this.baseUrl}leave-group?userID=${userId}&groupID=${groupId}`)
  // }

  // deleteGroup(userId:number, groupId:number) {
  //   return this.http.delete<any>(`${this.baseUrl}delete-group?groupID=${groupId}&userID=${userId}`)
  // }
}
