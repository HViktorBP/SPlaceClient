import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {jwtDecode, JwtPayload} from 'jwt-decode';
import {UserAccount} from "../data-transferring/dtos/user/user-account";
import {catchError, Observable, throwError} from "rxjs";
import {ChangeUsernameRequest} from "../data-transferring/contracts/user/change-username-request";
import {ChangePasswordRequest} from "../data-transferring/contracts/user/change-password-request";
import {ChangeStatusRequest} from "../data-transferring/contracts/user/change-status-request";

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  private baseUrl:string = "https://localhost:7149/api/Users/"

  constructor(private http : HttpClient) { }

  signUp(user: any) {
    return this.http.post<any>(`${this.baseUrl}register`, user).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  logIn(userData : any) {
    return this.http.post<any>(`${this.baseUrl}login`, userData).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  storeUserData(token: string) {
    const decodedJwt : any = this.decodeJwtToken(token)
    sessionStorage.setItem("userId", decodedJwt['userId'])
    sessionStorage.setItem("userName", decodedJwt['userName'])
    sessionStorage.setItem("token", token)
  }

  getUserAccount(id : number) : Observable<UserAccount> {
    return this.http.get<UserAccount>(`${this.baseUrl}${id}`).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  getUserId() : number {
    const userId = sessionStorage.getItem('userId')
    if (userId === null) throw new Error("No ID stored in localStorage")

    const parsedUserId = Number(userId)
    if (isNaN(parsedUserId)) throw new Error("Stored ID is not a valid number")

    return parsedUserId
  }

  getUserName() : string {
    const userName = sessionStorage.getItem('userName')

    if (userName === null) throw new Error("No ID stored in localStorage")

    return userName
  }

  changeUsername(userDataChange : ChangeUsernameRequest) {
    return this.http.put<any>(`${this.baseUrl}username`, userDataChange).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  changePassword(userDataChange : ChangePasswordRequest) {
    return this.http.put<any>(`${this.baseUrl}password`, userDataChange).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  changeStatus(userDataChange : ChangeStatusRequest) {
    return this.http.put<any>(`${this.baseUrl}status`, userDataChange).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
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
    sessionStorage.removeItem("userName")
  }

  isTokenExpired(): boolean {
    const token = sessionStorage.getItem("token")
    if (!token) return true

    let isTokenExpired : boolean = true

    const decodedJwt = this.decodeJwtToken(token);
    if (decodedJwt.exp !== undefined)
      isTokenExpired = Date.now() >= decodedJwt.exp * 1000;

    if (isTokenExpired)
      this.logOut()

    return isTokenExpired
  }

  private decodeJwtToken(token : string) : JwtPayload {
    try {
      return jwtDecode(token)
    } catch (error) {
      throw error
    }
  }
}
