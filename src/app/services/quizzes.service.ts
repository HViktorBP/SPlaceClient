import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {QuizDto} from "../dtos/quiz/quiz-dto";
import {CreateQuizRequest} from "../contracts/quiz/create-quiz-request";

@Injectable({
  providedIn: 'root'
})

export class QuizzesService {
  private baseUrl = 'https://localhost:7149/api/Quizzes/';
  constructor(private http : HttpClient) { }

  getQuiz(quizId: number) {
    return this.http.get<QuizDto>(`${this.baseUrl}${quizId}`)
  }

  createNewQuiz(createQuizRequest : CreateQuizRequest) {
    return this.http.post<any>(`${this.baseUrl}create`, createQuizRequest)
  }

  getQuizId(groupID:number, quizName: string) {
    return this.http.get<number>(`${this.baseUrl}get-quiz-id?groupID=${groupID}&quizName=${quizName}`)
  }

  submitQuizResult(userID: number, groupID: number, quizID: number, quiz: any) {
    return this.http.post<any>(`${this.baseUrl}submit-quiz-result?userID=${userID}&groupID=${groupID}&quizID=${quizID}`, quiz)
  }

  // deleteQuiz (quizBody:QuizzesDTO, userID:number, role:string) {
  //   return this.http.delete<any>(`${this.baseUrl}delete-quiz-from-group?userID=${userID}&role=${role}`, {body: quizBody})
  // }
}
