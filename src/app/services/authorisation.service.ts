import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../interfaces/user";
import {Quote} from "../interfaces/quote";

@Injectable({
  providedIn: 'root'
})
export class AuthorisationService {
  private baseUrl:string = "https://localhost:7149/api/User/"
  constructor(private http : HttpClient) { }

  signUp(username: string, password: string, email: string) {
    const formData = { username, password, email};
    return this.http.post<any>(`${this.baseUrl}register`, formData)
  }

  logIn(username: string, password: string) {
    const formData = { username, password };
    return this.http.post<any>(`${this.baseUrl}authentication`, formData);
  }

  storeToken(tokenValue: string) { //singleton service
    localStorage.setItem("token", tokenValue)
  }

  storeUsername(username: string) { //singleton service
    localStorage.setItem("username", username)
  }

  getUser(username:string) {
    return this.http.get<User>(`${this.baseUrl}user?username=${username}`)
  }

  getUserID(username:string)  {
    return this.http.get<number>(`${this.baseUrl}id?username=${username}`)
  }

  getUsername() {
    return localStorage.getItem("username")!!
  }

  getQuote() {
    return this.http.get<Quote>(`${this.baseUrl}quote`)
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("token") // converts to bool
  }
}
