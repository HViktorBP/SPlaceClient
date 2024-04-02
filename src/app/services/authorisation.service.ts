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

  getUser() {
    const username = this.getUsername()
    return this.http.get<User>(`${this.baseUrl}user?username=${username}`)
  }

  getQuote() {
    return this.http.get<Quote>(`${this.baseUrl}quote`)
  }

  getUsername() {
    return localStorage.getItem("username")!!
  }

  getToken() {
    return localStorage.getItem("token")
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("token") // converts to bool
  }
}
