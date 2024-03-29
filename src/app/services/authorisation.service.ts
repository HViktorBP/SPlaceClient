import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

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

  logIn(username: string, password: string): Observable<any> {
    const formData = { username, password };
    return this.http.post<any>(`${this.baseUrl}authentication`, formData);
  }

  storeToken(tokenValue: string) { //singleton service
    localStorage.setItem("token", tokenValue)
  }

  getToken() {
    return localStorage.getItem("token")
  }

  isLoggedIn(): boolean {
    console.log("I'm here")
    return !!localStorage.getItem("token") // converts to bool
  }
}
