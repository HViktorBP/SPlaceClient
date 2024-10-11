import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {QuizzesDTO} from "../dtos/quizzes-dto";
import {QuizModel} from "../dtos/quiz-model";

@Injectable({
  providedIn: 'root'
})

export class QuizzesService {
  private baseUrl = 'https://localhost:7149/api/Quizzes/';
  constructor(private http : HttpClient) { }

  getQuizzesInGroup(groupID: number) {
    return this.http.get<QuizzesDTO[]>(`${this.baseUrl}quizzes-in-group?groupID=${groupID}`)
  }

  submitNewQuiz(userID: number, groupID: number, role: string, quiz: any) {
    return this.http.post<any>(`${this.baseUrl}add-new-quiz?userID=${userID}&groupID=${groupID}&role=${role}`, quiz)
  }

  getQuizId(groupID:number, quizName: string) {
    return this.http.get<number>(`${this.baseUrl}get-quiz-id?groupID=${groupID}&quizName=${quizName}`)
  }

  getQuiz(groupID:number, quizId: number) {
    return this.http.get<QuizModel>(`${this.baseUrl}get-quiz?groupID=${groupID}&quizId=${quizId}`)
  }

  submitQuizResult(userID: number, groupID: number, quizID: number, quiz: any) {
    return this.http.post<any>(`${this.baseUrl}submit-quiz-result?userID=${userID}&groupID=${groupID}&quizID=${quizID}`, quiz)
  }

  deleteQuiz (quizBody:QuizzesDTO, userID:number, role:string) {
    return this.http.delete<any>(`${this.baseUrl}delete-quiz-from-group?userID=${userID}&role=${role}`, {body: quizBody})
  }
}
