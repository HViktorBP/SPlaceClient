import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class GroupsService {
  private baseUrl = 'https://localhost:7149/api/Group/';
  constructor(private http : HttpClient) { }

  getGroups(id:number) {
    return this.http.get<number[]>(`${this.baseUrl}groups?userID=${id}`)
  }

  getGroupById(groupId: number) {
    return this.http.get<string>(`${this.baseUrl}group-by-id?groupID=${groupId}`)
  }

  getGroupCreator(groupId: number) {
    return this.http.get<number>(`${this.baseUrl}group-creator?groupID=${groupId}`)
  }

  getUsersInGroup(groupId: number) {
    return this.http.get<number[]>(`${this.baseUrl}users-in-group?groupID=${groupId}`)
  }

  getUserRole(userId: number, groupId: number) {
    return this.http.get<string>(`${this.baseUrl}user-role?userID=${userId}&groupID=${groupId}`)
  }

  addGroup(userId: number, groupName: string) {
    const group = {userId, groupName}
    return this.http.post<any>(`${this.baseUrl}add-group`, group)
  }

  addUserInGroup(userId:number, groupId:number, role:string, currentUserRole : string) {
    const usersGroup = {userId, groupId, role}
    return this.http.post<any>(`${this.baseUrl}add-user-in-group?currentUserRole=${currentUserRole}`, usersGroup)
  }

  deleteUserFromGroup(userId:number, groupId:number, role:string, currentUserRole:string) {
    return this.http.delete<any>(`${this.baseUrl}delete-user-from-group?role=${currentUserRole}`, {body : {userId, groupId, role}})
  }

  leaveGroup(userId:number, groupId:number) {
    return this.http.delete<any>(`${this.baseUrl}leave-group?userID=${userId}&groupID=${groupId}`)
  }

  deleteGroup(userId:number, groupId:number) {
    return this.http.delete<any>(`${this.baseUrl}delete-group?groupID=${groupId}&userID=${userId}`)
  }
}
