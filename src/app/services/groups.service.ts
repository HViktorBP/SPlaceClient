import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {GroupDto} from "../data-transferring/dtos/group/group-dto";
import {Role} from "../data-transferring/enums/role";
import {ChangeRoleRequest} from "../data-transferring/contracts/group/change-role-request";
import {CreateGroupRequest} from "../data-transferring/contracts/group/create-group-request";
import {AddUserRequest} from "../data-transferring/contracts/group/add-user-request";
import {RenameGroupRequest} from "../data-transferring/contracts/group/rename-group-request";
import {UserGroupRequest} from "../data-transferring/contracts/group/user-group-request";
import {RemoveUserRequest} from "../data-transferring/contracts/group/remove-user-request";

@Injectable({
  providedIn: 'root'
})

export class GroupsService {
  private baseUrl = 'https://localhost:7149/api/Groups/';

  constructor(private http : HttpClient) { }

  getGroup(id:number) {
    return this.http.get<GroupDto>(`${this.baseUrl}${id}`)
  }

  getRole(userId : number, groupId : number) {
    return this.http.get<Role>(`${this.baseUrl}role?userId=${userId}&groupId=${groupId}`)
  }

  changeRole(changeRoleRequest : ChangeRoleRequest) {
    return this.http.put<any>(`${this.baseUrl}role`, changeRoleRequest)
  }

  createGroup (createGroupRequest : CreateGroupRequest) {
    return this.http.post<any>(`${this.baseUrl}create`, createGroupRequest)
  }

  addUser (addUserRequest : AddUserRequest) {
    return this.http.post<any>(`${this.baseUrl}add`, addUserRequest)
  }

  renameGroup (renameGroupRequest : RenameGroupRequest) {
    return this.http.put<any>(`${this.baseUrl}rename`, renameGroupRequest)
  }

  leaveGroup(leaveGroupRequest : UserGroupRequest) {
    return this.http.delete<any>(`${this.baseUrl}leave`, {"body": leaveGroupRequest})
  }

  removeUser(removeUserRequest : RemoveUserRequest) {
    return this.http.delete<any>(`${this.baseUrl}remove`, {"body" : removeUserRequest})
  }

  deleteGroup(deleteGroupRequest : UserGroupRequest) {
    return this.http.delete<any>(`${this.baseUrl}group`, {"body" : deleteGroupRequest})
  }

  // leaveGroup(userId:number, groupId:number) {
  //   return this.http.delete<any>(`${this.baseUrl}leave-group?userID=${userId}&groupID=${groupId}`)
  // }

  // deleteGroup(userId:number, groupId:number) {
  //   return this.http.delete<any>(`${this.baseUrl}delete-group?groupID=${groupId}&userID=${userId}`)
  // }
}
