import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../dtos/user";
import {jwtDecode, JwtPayload} from 'jwt-decode';
import {UserAccount} from "../dtos/user/user-account";
import {Observable} from "rxjs";
import {ChangeUsername} from "../contracts/user/change-username";
import {ChangePassword} from "../contracts/user/change-password";
import {ChangeStatus} from "../contracts/user/change-status";

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  private baseUrl:string = "https://localhost:7149/api/Users/"

  constructor(private http : HttpClient) { }

  signUp(user: any) {
    return this.http.post<any>(`${this.baseUrl}register`, user)
  }

  logIn(userData : any) {
    return this.http.post<any>(`${this.baseUrl}login`, userData);
  }

  storeUserData(token: string) {
    const decodedJwt : any = this.decodeJwtToken(token)
    sessionStorage.setItem("userId", decodedJwt['userId'])
    sessionStorage.setItem("userName", decodedJwt['userName'])
    sessionStorage.setItem("token", token)
  }

  getUserAccount(id : number) : Observable<UserAccount> {
    return this.http.get<UserAccount>(`${this.baseUrl}${id}`)
  }

  getUserId() : number {
    const userId = sessionStorage.getItem('userId');

    if (userId === null) {
      throw new Error("No ID stored in localStorage");
    }

    const parsedUserId = Number(userId);

    if (isNaN(parsedUserId)) {
      throw new Error("Stored ID is not a valid number");
    }

    return parsedUserId;
  }

  getUserName() : string {
    const userName = sessionStorage.getItem('userName');

    if (userName === null) {
      throw new Error("No ID stored in localStorage");
    }

    return userName;
  }

  changeUsername(userDataChange : ChangeUsername) {
    return this.http.put<string>(`${this.baseUrl}username`, userDataChange)
  }

  changePassword(userDataChange : ChangePassword) {
    return this.http.put<string>(`${this.baseUrl}password`, userDataChange)
  }

  changeStatus(userDataChange : ChangeStatus) {
    return this.http.put<string>(`${this.baseUrl}status`, userDataChange)
  }

  deleteAccount() {
    const userId = this.getUserId();
    return this.http.delete<any>(`${this.baseUrl}${userId}`)
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem("token")
  }

  logOut(): void {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("userId")
  }

  isTokenExpired(): boolean {
    const token = sessionStorage.getItem("token")
    if (!token) return true;

    let isTokenExpired : boolean = true

    const decodedJwt = this.decodeJwtToken(token);
    if (decodedJwt.exp !== undefined)
      isTokenExpired = Date.now() >= decodedJwt.exp * 1000;

    if (isTokenExpired)
      this.logOut()

    return isTokenExpired;
  }

  // --- old --- //

  getUserByName(username:string) {
    return this.http.get<User>(`${this.baseUrl}user-by-name?username=${username}`)
  }

  getUserByID(id:number) {
    return this.http.get<User>(`${this.baseUrl}user-by-id?id=${id}`)
  }

  getUserID(username:string)  {
    return this.http.get<number>(`${this.baseUrl}id?username=${username}`)
  }

  getUsername() {
    return sessionStorage.getItem("username")!!
  }



  private decodeJwtToken(token : string) : JwtPayload {
    try {
      return jwtDecode(token);
    } catch (e) {
      throw e;
    }
  }
}
