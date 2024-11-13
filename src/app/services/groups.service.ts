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
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

/**
 * GroupsService is responsible for managing group- and user-group- related operations, including
 * retrieving, creating, updating, and deleting group/user-group data by communicating with the backend API.
 */

export class GroupsService {
  /**
   * baseUrl is the endpoint used to communicate with the server for user-group-/group-related operations.
   * @private
   */
  private baseUrl = environment.apiUrl + 'Groups/'

  constructor(private http : HttpClient) { }

  /**
   * getGroup method sends HTTP request to retrieve group's data.
   * @param groupId - group's id.
   */
  getGroup(groupId:number) {
    return this.http.get<GroupDto>(`${this.baseUrl}${groupId}`).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * getRole method sends HTTP request to retrieve user's role in group.
   * @param userId - user's id.
   * @param groupId - group's id.
   */
  getRole(userId : number, groupId : number) {
    return this.http.get<Role>(`${this.baseUrl}role?userId=${userId}&groupId=${groupId}`).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * changeRole method sends HTTP request to change user's role in a group.
   * @param changeRolePayload - data needed for user's role to be changed.
   */
  changeRole(changeRolePayload : ChangeRoleRequest) {
    return this.http.put<any>(`${this.baseUrl}role`, changeRolePayload).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * createGroup method sends HTTP request to create a group.
   * @param createGroupPayload - data needed for group to be created.
   */
  createGroup (createGroupPayload : CreateGroupRequest) {
    return this.http.post<any>(`${this.baseUrl}create`, createGroupPayload).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * addUser method sends HTTP request to add user to the group.
   * @param addUserPayload - data needed for user to be added to the group.
   */
  addUser (addUserPayload : AddUserRequest) {
    return this.http.post<any>(`${this.baseUrl}add`, addUserPayload).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * renameGroup method sends HTTP request to rename the group.
   * @param renameGroupPayload - data needed for group to be renamed.
   */
  renameGroup (renameGroupPayload : RenameGroupRequest) {
    return this.http.put<any>(`${this.baseUrl}rename`, renameGroupPayload).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * leaveGroupPayload method sends HTTP request to leave the group.
   * @param leaveGroupPayload - data needed for user to leave the group.
   */
  leaveGroup(leaveGroupPayload : UserGroupRequest) {
    return this.http.delete<any>(`${this.baseUrl}leave`, {"body": leaveGroupPayload}).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }
  /**
   * removeUser method sends HTTP request to remove the user from the group.
   * @param removeUserPayload - data needed for user to be removed from the group.
   */
  removeUser(removeUserPayload : RemoveUserRequest) {
    return this.http.delete<any>(`${this.baseUrl}remove`, {"body" : removeUserPayload}).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * deleteGroup method sends HTTP request to delete the group.
   * @param deleteGroupPayload
   */
  deleteGroup(deleteGroupPayload : UserGroupRequest) {
    return this.http.delete<any>(`${this.baseUrl}group`, {"body" : deleteGroupPayload}).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }
}
