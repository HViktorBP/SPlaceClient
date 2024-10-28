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
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class GroupsService {
  private baseUrl = 'https://localhost:7149/api/Groups/';

  constructor(private http : HttpClient) { }

  getGroup(id:number) {
    return this.http.get<GroupDto>(`${this.baseUrl}${id}`).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  getRole(userId : number, groupId : number) {
    return this.http.get<Role>(`${this.baseUrl}role?userId=${userId}&groupId=${groupId}`).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  changeRole(changeRoleRequest : ChangeRoleRequest) {
    return this.http.put<any>(`${this.baseUrl}role`, changeRoleRequest).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  createGroup (createGroupRequest : CreateGroupRequest) {
    return this.http.post<any>(`${this.baseUrl}create`, createGroupRequest).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  addUser (addUserRequest : AddUserRequest) {
    return this.http.post<any>(`${this.baseUrl}add`, addUserRequest).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  renameGroup (renameGroupRequest : RenameGroupRequest) {
    return this.http.put<any>(`${this.baseUrl}rename`, renameGroupRequest).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  leaveGroup(leaveGroupRequest : UserGroupRequest) {
    return this.http.delete<any>(`${this.baseUrl}leave`, {"body": leaveGroupRequest}).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  removeUser(removeUserRequest : RemoveUserRequest) {
    return this.http.delete<any>(`${this.baseUrl}remove`, {"body" : removeUserRequest}).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  deleteGroup(deleteGroupRequest : UserGroupRequest) {
    return this.http.delete<any>(`${this.baseUrl}group`, {"body" : deleteGroupRequest}).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }
}
