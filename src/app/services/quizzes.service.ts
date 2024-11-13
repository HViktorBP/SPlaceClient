import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {QuizDto} from "../data-transferring/dtos/quiz/quiz-dto";
import {SubmitQuizRequest} from "../data-transferring/contracts/quiz/submit-quiz-request";
import {DeleteQuizRequest} from "../data-transferring/contracts/quiz/delete-quiz-request";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {QuestionDto} from "../data-transferring/dtos/question/question-dto";
import {Question} from "../data-transferring/enums/question";
import {AnswerDto} from "../data-transferring/dtos/answer/answer-dto";
import {catchError, throwError} from "rxjs";
import {QuizValidators} from "../custom/valiators/QuizValidators";

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


  getQuizWithoutCorrectAnswers(quizId: number) {
    return this.http.get<QuizDto>(`${this.baseUrl}${quizId}/unanswered`).pipe(
      catchError(err => {
        return throwError(() => err)
      })
    )
  }

  createNewQuiz(submitQuizRequest : SubmitQuizRequest) {
    return this.http.post<any>(`${this.baseUrl}create`, submitQuizRequest).pipe(
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

  deleteQuiz(deleteQuizRequest : DeleteQuizRequest) {
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
      name: [quiz.name, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      questions: this.fb.array(quiz.questions.map(question => this.createQuestionFormGroup(question)))
    }, { updateOn: "blur" }
    )
  }

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

  createAnswerFormGroup(answer: AnswerDto) {
    return this.fb.group({
      id: [answer.id],
      answer: [answer.answer, [Validators.required]],
      status: [answer.status, [Validators.required]]
    })


  }

  /**
   * Description: processes quiz data by deleting all the unnecessary controls from it.
   * @param questions -
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
   * Description: sets validators for the questions
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
   * Description: sets validators for the answers
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
