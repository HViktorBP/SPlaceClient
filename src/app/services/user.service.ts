import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../interfaces/user";
import {jwtDecode, JwtPayload} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private baseUrl:string = "https://localhost:7149/api/Users/"

  constructor(private http : HttpClient) { }

  signUp(user: any) {
    return this.http.post<any>(`${this.baseUrl}register`, user)
  }

  logIn(userData : any) {
    return this.http.post<any>(`${this.baseUrl}login`, userData);
  }

  storeToken(tokenValue: string) {
    localStorage.setItem("token", tokenValue)
  }

  storeUserData(token: string) {
    const decodedJwt : any = this.decodeJwtToken(token)
    localStorage.setItem("userId", decodedJwt['userId'])
    localStorage.setItem("token", token)
  }

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

  changeUsername(username : string, userID: number) {
    return this.http.put<any>(`${this.baseUrl}change-username?username=${username}&userID=${userID}`, {})
  }

  changePassword(password : string, userID: number) {
    return this.http.put<any>(`${this.baseUrl}change-password?password=${password}&userID=${userID}`, {})
  }

  changeStatus(status : string, userID: number) {
    return this.http.put<any>(`${this.baseUrl}change-status?status=${status}&userID=${userID}`, {})
  }

  changeEmail(email : string, userID: number) {
    return this.http.put<any>(`${this.baseUrl}change-email?email=${email}&userID=${userID}`, {})
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("token")
  }

  logOut(): void {
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
  }

  isTokenExpired(): boolean {
    const token = localStorage.getItem("token")
    if (!token) return true;

    let isTokenExpired : boolean = true

    const decodedJwt = this.decodeJwtToken(token);
    if (decodedJwt.exp !== undefined)
      isTokenExpired = Date.now() >= decodedJwt.exp * 1000;

    if (isTokenExpired)
      this.logOut()

    return isTokenExpired;
  }

  private decodeJwtToken(token : string) : JwtPayload {
    try {
      return jwtDecode(token);
    } catch (e) {
      throw e;
    }
  }
}
