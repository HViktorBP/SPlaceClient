import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {QuizesDTO} from "../interfaces/quizes-dto";

@Injectable({
  providedIn: 'root'
})
export class QuizesService {
  private baseUrl = 'https://localhost:7149/api/Quizes/';
  constructor(private http : HttpClient) { }

  getQuizesInGroup(groupID: number) {
    return this.http.get<QuizesDTO[]>(`${this.baseUrl}quizes-in-group?groupID=${groupID}`)
  }
}
