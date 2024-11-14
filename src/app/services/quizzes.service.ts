import {Injectable} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import {QuizDto} from "../data-transferring/dtos/quiz/quiz-dto";
import {SubmitQuizRequest} from "../data-transferring/contracts/quiz/submit-quiz-request";
import {DeleteQuizRequest} from "../data-transferring/contracts/quiz/delete-quiz-request";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {QuestionDto} from "../data-transferring/dtos/question/question-dto";
import {Question} from "../data-transferring/enums/question";
import {AnswerDto} from "../data-transferring/dtos/answer/answer-dto";
import {catchError, throwError} from "rxjs";
import {QuizValidators} from "../custom/valiators/QuizValidators";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})

/**
 * QuizzesService is responsible for managing quizzes-related operations, including
 * creating, updating, and deleting quizzes data mostly by communicating with the backend API.
 * It also provides methods for setting the validators for the quizzes if it's necessary.
 */

export class QuizzesService {
  /**
   * baseUrl is the endpoint used to communicate with the server for quizzes-related operations.
   * @private
   */
  private baseUrl = environment.apiUrl + 'Quizzes/'

  constructor(private http : HttpClient,
              private fb : FormBuilder) { }

  /**
   * getQuiz method sends HTTP request to retrieve quiz's data.
   * @param quizId - quiz's id.
   */
  getQuiz(quizId: number) {
    return this.http.get<QuizDto>(`${this.baseUrl}${quizId}`).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * getQuizWithoutCorrectAnswers method sends HTTP request to retrieve quiz's data without answers.
   * @param quizId - quiz's id.
   */
  getQuizWithoutCorrectAnswers(quizId: number) {
    return this.http.get<QuizDto>(`${this.baseUrl}${quizId}/unanswered`).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * createNewQuiz method sends HTTP request to create a new quiz in the group.
   * @param submitQuizPayload - data needed for quiz to be submitted.
   */
  createNewQuiz(submitQuizPayload : SubmitQuizRequest) {
    return this.http.post<any>(`${this.baseUrl}create`, submitQuizPayload).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * submitQuiz method sends HTTP request to submit quiz for checking.
   * @param submitQuizPayload - data needed for quiz to be submitted for checking.
   */
  submitQuiz(submitQuizPayload : SubmitQuizRequest) {
    return this.http.put<string>(`${this.baseUrl}submit`, submitQuizPayload).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * deleteQuiz method sends HTTP request to delete the quiz.
   * @param deleteQuizPayload - data needed for quiz to be deleted.
   */
  deleteQuiz(deleteQuizPayload : DeleteQuizRequest) {
    return this.http.delete<any>(`${this.baseUrl}quiz`, {body: deleteQuizPayload}).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * editQuiz method sends HTTP request to edit the quiz.
   * @param editQuizPayload - data needed for quiz to be edited.
   */
  editQuiz(editQuizPayload : SubmitQuizRequest) {
    return this.http.put<any>(`${this.baseUrl}edit`, editQuizPayload).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  /**
   * buildQuiz method builds reactive form based on quiz's fetched data.
   * @param quiz - quiz's fetched data.
   */
  buildQuiz(quiz : QuizDto) {
    return this.fb.group({
      id: quiz.id,
      groupId: quiz.groupId,
      name: [quiz.name, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      questions: this.fb.array(quiz.questions.map(question => this.createQuestionFormGroup(question)))
    })
  }

  /**
   * createQuestionFormGroup method creates question control for quiz's form based on fetched data.
   * @param question - question's fetched data.
   */
  createQuestionFormGroup(question: QuestionDto) {
    const questionConfig: any = {
      id: [question.id],
      question: [question.question, Validators.required],
      type: [question.type],
      answers: this.fb.array(question.answers.map(answer => this.createAnswerFormGroup(answer))),
    }

    if (question.type === Question.SingleAnswer) {
      const answer = question.answers.find(a => a.status)
      if (answer) {
        questionConfig.selectedAnswer = [0, [Validators.required]]
      } else {
        questionConfig.selectedAnswer = [null, [Validators.required]]
      }
    }

    return this.fb.group(questionConfig)
  }

  /**
   * createAnswerFormGroup method creates answer control for quiz's question control based on fetched data.
   * @param answer - answer's fetched data.
   */
  createAnswerFormGroup(answer: AnswerDto) {
    return this.fb.group({
      id: [answer.id],
      answer: [answer.answer, [Validators.required]],
      status: [answer.status, [Validators.required]]
    })
  }

  /**
   * Description: processes quiz data by deleting all the unnecessary controls from it.
   * @param questions - array of question in reactive form.
   * @private
   */
  processQuizBeforeSubmit(questions : FormArray) {
    questions.controls.forEach((question: any, index: number) => {
      if (question.type === 0 && question.selectedAnswer) {
        question.answers.forEach((answer: any, index : number) => {
          console.log(question.selectedAnswer, index)
          answer.status = index == question.selectedAnswer
        })

        const questionFormGroup = questions.at(index) as FormGroup
        questionFormGroup.removeControl('selectedAnswer')
      }
    })
  }

  /**
   * Description: sets validators for the questions of quiz's form.
   * @param quizForm - quiz's form.
   * @private
   */
  setValidatorsForQuestions(quizForm : FormGroup) {
    const questionsArray = quizForm.get('questions') as FormArray;
    questionsArray.setValidators([
      QuizValidators.atLeastOneCorrectAnswer(),
      QuizValidators.quizHasQuestionsValidator(),
      QuizValidators.uniqueQuestionsValidator()
    ])

    questionsArray.updateValueAndValidity()

    questionsArray.controls.forEach((questionControl) => {
      questionControl.get('question')?.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(500)]);
    })

    questionsArray.updateValueAndValidity()

    questionsArray.controls.forEach((questionControl) => {
      this.setValidatorsForAnswers(questionControl);
    })
  }

  /**
   * Description: sets validators for the answers of quiz's form.
   * @param questionControl - question to which answers belong.
   * @private
   */
   setValidatorsForAnswers(questionControl: any) {
    const answersArray = questionControl.get('answers') as FormArray;
    answersArray.setValidators([
      QuizValidators.uniqueAnswersValidator()
    ])

    answersArray.updateValueAndValidity()

    answersArray.controls.forEach((answersControl) => {
      answersControl.get('answer')?.setValidators([Validators.required, Validators.minLength(1), Validators.maxLength(500)]);
    })

    answersArray.updateValueAndValidity()
  }
}
