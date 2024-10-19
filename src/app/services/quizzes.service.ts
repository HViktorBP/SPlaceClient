import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {QuizDto} from "../dtos/quiz/quiz-dto";
import {CreateQuizRequest} from "../contracts/quiz/create-quiz-request";
import {SubmitQuizRequest} from "../contracts/quiz/submit-quiz-request";
import {DeleteQuizRequest} from "../contracts/quiz/delete-quiz-request";
import {FormBuilder, Validators} from "@angular/forms";
import {QuestionDto} from "../dtos/question/question-dto";
import {Question} from "../enums/question";
import {AnswerDto} from "../dtos/answer/answer-dto";

@Injectable({
  providedIn: 'root'
})

export class QuizzesService {
  private baseUrl = 'https://localhost:7149/api/Quizzes/'

  constructor(private http : HttpClient,
              private fb : FormBuilder) { }

  getQuiz(quizId: number) {
    return this.http.get<QuizDto>(`${this.baseUrl}${quizId}`)
  }

  createNewQuiz(createQuizRequest : CreateQuizRequest) {
    return this.http.post<any>(`${this.baseUrl}create`, createQuizRequest)
  }

  submitQuiz(submitQuizRequest : SubmitQuizRequest) {
    return this.http.put<string>(`${this.baseUrl}submit`, submitQuizRequest)
  }

  deleteQuiz (deleteQuizRequest : DeleteQuizRequest) {
    return this.http.delete<any>(`${this.baseUrl}quiz`, {body: deleteQuizRequest})
  }

  editQuiz(editQuizRequest : SubmitQuizRequest) {
    return this.http.put<any>(`${this.baseUrl}edit`, editQuizRequest)
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
      answers: this.fb.array(question.answers.map(answer => this.createAnswerFormGroup(answer)))
    };

    if (question.type === Question.SingleAnswer) {
      const answer = question.answers.find(a => a.status)
      if (answer) {
        formGroupConfig.selectedAnswer = [answer.answer, Validators.required];
      } else {
        formGroupConfig.selectedAnswer = [null, Validators.required];
      }
    }

    return this.fb.group(formGroupConfig);
  }

  createAnswerFormGroup(answer: AnswerDto) {
    return this.fb.group({
      id: [answer.id],
      answer: [answer.answer, Validators.required],
      status: [answer.status]
    });
  }

}
