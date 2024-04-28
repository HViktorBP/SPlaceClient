import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {QuizzesDTO} from "../interfaces/quizes-dto";

@Injectable({
  providedIn: 'root'
})
export class QuizzesService {
  private baseUrl = 'https://localhost:7149/api/Quizes/';
  constructor(private http : HttpClient) { }

  getQuizzesInGroup(groupID: number) {
    return this.http.get<QuizzesDTO[]>(`${this.baseUrl}quizes-in-group?groupID=${groupID}`)
  }

  submitNewQuiz(userID: number, groupID: number, role: string, quiz: any) {
    return this.http.post<any>(`${this.baseUrl}add-new-quiz?userID=${userID}&groupID=${groupID}&role=${role}`, quiz)
  }
}
