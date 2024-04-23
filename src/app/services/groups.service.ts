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

  getUsersInGroup(groupId: number) {
    return this.http.get<number[]>(`${this.baseUrl}users-in-group?groupID=${groupId}`)
  }

  addGroup(userID: number, groupName: string) {
    const group = {userID, groupName}
    return this.http.post<any>(`${this.baseUrl}add-group`, group)
  }

  addUserInGroup(userID:number, groupID:number) {
    const usersGroup = {userID, groupID}
    return this.http.post<any>(`${this.baseUrl}add-user-in-group`, usersGroup)
  }
}
