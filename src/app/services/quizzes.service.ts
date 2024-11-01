import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {QuizDto} from "../data-transferring/dtos/quiz/quiz-dto";
import {CreateQuizRequest} from "../data-transferring/contracts/quiz/create-quiz-request";
import {SubmitQuizRequest} from "../data-transferring/contracts/quiz/submit-quiz-request";
import {DeleteQuizRequest} from "../data-transferring/contracts/quiz/delete-quiz-request";
import {FormBuilder, Validators} from "@angular/forms";
import {QuestionDto} from "../data-transferring/dtos/question/question-dto";
import {Question} from "../data-transferring/enums/question";
import {AnswerDto} from "../data-transferring/dtos/answer/answer-dto";
import {catchError, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class QuizzesService {
  private baseUrl = 'https://localhost:7149/api/Quizzes/'

  constructor(private http : HttpClient,
              private fb : FormBuilder) { }

  getQuiz(quizId: number) {
    return this.http.get<QuizDto>(`${this.baseUrl}${quizId}`).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  createNewQuiz(createQuizRequest : CreateQuizRequest) {
    return this.http.post<any>(`${this.baseUrl}create`, createQuizRequest).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  submitQuiz(submitQuizRequest : SubmitQuizRequest) {
    return this.http.put<string>(`${this.baseUrl}submit`, submitQuizRequest).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  deleteQuiz (deleteQuizRequest : DeleteQuizRequest) {
    return this.http.delete<any>(`${this.baseUrl}quiz`, {body: deleteQuizRequest}).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  editQuiz(editQuizRequest : SubmitQuizRequest) {
    return this.http.put<any>(`${this.baseUrl}edit`, editQuizRequest).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  buildQuiz(quiz : QuizDto) {
    return this.fb.group({
      id: [quiz.id],
      groupId: [quiz.groupId],
      name: [quiz.name, Validators.required],
      questions: this.fb.array(quiz.questions.map(question => this.createQuestionFormGroup(question)))
    })
  }

  createQuestionFormGroup(question: QuestionDto) {
    const formGroupConfig: any = {
      id: [question.id],
      question: [question.question, Validators.required],
      type: [question.type],
      answers: this.fb.array(question.answers.map(answer => this.createAnswerFormGroup(answer))),
    }

    if (question.type === Question.SingleAnswer) {
      const answer = question.answers.find(a => a.status)
      if (answer) {
        formGroupConfig.selectedAnswer = [answer.answer, Validators.required]
      } else {
        formGroupConfig.selectedAnswer = [null, Validators.required]
      }
    }

    return this.fb.group(formGroupConfig)
  }

  createAnswerFormGroup(answer: AnswerDto) {
    return this.fb.group({
      id: [answer.id],
      answer: [answer.answer, Validators.required],
      status: [answer.status]
    })
  }
}
