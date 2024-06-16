import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../interfaces/user";
import {Quote} from "../interfaces/quote";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl:string = "https://localhost:7149/api/User/"

  constructor(private http : HttpClient) { }

  signUp(username: string, password: string, email: string | null) {
    const formData = { username, password, email};
    return this.http.post<any>(`${this.baseUrl}register`, formData)
  }

  logIn(username: string, password: string) {
    const formData = { username, password };
    return this.http.post<any>(`${this.baseUrl}authentication`, formData);
  }

  storeToken(tokenValue: string) { //singleton service
    sessionStorage.setItem("token", tokenValue)
  }

  storeUsername(username: string) { //singleton service
    sessionStorage.setItem("username", username)
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

  getQuote() {
    return this.http.get<Quote>(`${this.baseUrl}quote`)
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
    return !!sessionStorage.getItem("token") // converts to bool
  }
}
