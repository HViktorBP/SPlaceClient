import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {jwtDecode, JwtPayload} from 'jwt-decode';
import {UserAccount} from "../data-transferring/dtos/user/user-account";
import {catchError, Observable, throwError} from "rxjs";
import {ChangeUsernameRequest} from "../data-transferring/contracts/user/change-username-request";
import {ChangePasswordRequest} from "../data-transferring/contracts/user/change-password-request";
import {ChangeStatusRequest} from "../data-transferring/contracts/user/change-status-request";
import {environment} from "../../environments/environment";
import {UserLogInRequest} from "../data-transferring/contracts/user/user-log-in-request";
import {UserRegistrationRequest} from "../data-transferring/contracts/user/user-registration-request";
import {ChangeEmailRequest} from "../data-transferring/contracts/user/change-email-request";

@Injectable({
  providedIn: 'root'
})

/**
 * UsersService is responsible for managing user-related operations, including
 * retrieving, creating, updating, and deleting user data mostly by communicating with the backend API.
 */

export class UsersService {
  /**
   * baseUrl is the endpoint used to communicate with the server for user-related operations.
   * @private
   */
  private baseUrl:string = environment.apiUrl + 'Users/'

  constructor(private http : HttpClient) { }

  /**
   * signUp method registers user in application.
   * @param userData - user's username, password and email
   */
  signUp(userData: UserRegistrationRequest) {
    return this.http.post<{message: string}>(`${this.baseUrl}register`, userData).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * logIn method logs user into the application.
   * @param userData - user's username and password
   */
  logIn(userData : UserLogInRequest) {
    return this.http.post<{token: string, message: string}>(`${this.baseUrl}login`, userData).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * storeUserData method stores user's token, username and user's id to the session storage of the application.
   * @param token - user's JWT token
   */
  storeUserData(token: string) : void {
    const decodedJwt : any = this.decodeJwtToken(token)
    sessionStorage.setItem("userId", decodedJwt['userId'])
    sessionStorage.setItem("userName", decodedJwt['userName'])
    sessionStorage.setItem("token", token)
  }

  /**
   * getUserAccount method sends HTTP request to retrieve data related to user's account.
   * @param userId - user's id
   */
  getUserAccount(userId : number) : Observable<UserAccount> {
    return this.http.get<UserAccount>(`${this.baseUrl}${userId}`).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * getUserId method gets the user's id stored in session storage.
   */
  getUserId() : number {
    const userId = sessionStorage.getItem('userId')
    if (userId === null) throw new Error("No ID stored in sessionStorage")

    const parsedUserId = Number(userId)
    if (isNaN(parsedUserId)) throw new Error("Stored ID is not a valid number")

    return parsedUserId
  }

  /**
   * getUserName method gets the user's username stored in session storage.
   */
  getUserName() : string {
    const userName = sessionStorage.getItem('userName')

    if (userName === null) throw new Error("No username stored in sessionStorage")

    return userName
  }

  /**
   * changeUsername method sends a http request to change user's name.
   * @param {ChangeUsernameRequest} changeUsernamePayload - data needed for user's username to be changed
   */
  changeUsername(changeUsernamePayload : ChangeUsernameRequest) {
    return this.http.put<{message: string, token: string}>(`${this.baseUrl}username`, changeUsernamePayload).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * changePassword method sends a http request to change user's password.
   * @param {ChangePasswordRequest} changePasswordPayload - data needed for user's password to be changed.
   */
  changePassword(changePasswordPayload : ChangePasswordRequest) {
    return this.http.put<{message: string}>(`${this.baseUrl}password`, changePasswordPayload).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * changeEmail method sends a http request to change user's email.
   * @param {ChangeEmailRequest} changeEmailPayload - data needed for user's email to be changed.
   */
  changeEmail(changeEmailPayload : ChangeEmailRequest) {
    return this.http.put<{message: string}>(`${this.baseUrl}email`, changeEmailPayload).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * changeStatus method sends a http request to change user's status.
   * @param {ChangeStatusRequest} changeStatusPayload - data needed for user's status to be changed.
   */
  changeStatus(changeStatusPayload : ChangeStatusRequest) {
    return this.http.put<void>(`${this.baseUrl}status`, changeStatusPayload).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * changeStatus method sends a http request to delete user's account.
   */
  deleteAccount() {
    const userId = this.getUserId()
    return this.http.delete<{message: string}>(`${this.baseUrl}${userId}`).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * isLoggedIn method checks whether user is logged in or not.
   */
  isLoggedIn(): boolean {
    return !!sessionStorage.getItem("token")
  }

  /**
   * logOut method logs user out od the application.
   */
  logOut(): void {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("userId")
    sessionStorage.removeItem("userName")
    sessionStorage.removeItem("aboutAppPopUpShowed")
  }

  /**
   * isTokenExpired method checks whether JWT token has already expired or not.
   */
  isTokenExpired(): boolean {
    const token = sessionStorage.getItem("token")
    if (!token) return true

    let isTokenExpired : boolean = true

    const decodedJwt = this.decodeJwtToken(token)
    if (decodedJwt.exp !== undefined)
      isTokenExpired = Date.now() >= decodedJwt.exp * 1000

    if (isTokenExpired)
      this.logOut()

    return isTokenExpired
  }

  /**
   * decodeJwtToken decodes the JWT token of user.
   * @param token
   * @private
   */
  private decodeJwtToken(token : string) : JwtPayload {
    try {
      return jwtDecode(token)
    } catch (error) {
      throw error
    }
  }
}
