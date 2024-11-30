import {AbstractControl, FormArray, ValidationErrors, ValidatorFn} from "@angular/forms";

/**
 * QuizValidators class provide different validators for quiz.
 */

export class QuizValidators {
  /**
   * Description: atLeastOneCorrectAnswer validates whether each question has at least one correct answer
   */
  public static atLeastOneCorrectAnswer(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let hasNoCorrect = false

      if (control instanceof FormArray) {
        control.controls.forEach((questionControl) => {
          const answers = questionControl.get('answers') as FormArray

          const atLeastOneCorrect = answers.controls.some(answer => answer.get('status')?.value === true)
          if (!atLeastOneCorrect) {
            hasNoCorrect = true
          }
        })
      }

      return hasNoCorrect ? { atLeastOneCorrect: true } : null;
    }
  }

  /**
   * Description: quizHasQuestionsValidator validates whether quiz at least one question
   */
  public static quizHasQuestionsValidator(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      if (formArray instanceof FormArray) {
        if (formArray.length === 0) {
          return { noQuestions: true }
        }
      }
      return null
    }
  }

  static uniqueQuestionsValidator(): ValidatorFn {
    return (questions: AbstractControl): ValidationErrors | null => {
      const questionsArray = questions as FormArray
      const questionSet = new Set<string>()

      for (let i = 0; i < questionsArray.length; i++) {
        const questionText = questionsArray.at(i).get('question')?.value?.trim().toLowerCase()
        if (questionText && questionSet.has(questionText)) {
          return { duplicateQuestions: true }
        }
        questionSet.add(questionText)
      }
      return null
    }
  }

  static uniqueAnswersValidator(): ValidatorFn {
    return (answers: AbstractControl): ValidationErrors | null => {
      const answersArray = answers as FormArray
      const answerSet = new Set<string>()

      for (let i = 0; i < answersArray.length; i++) {
        const answerText = answersArray.at(i).get('answer')?.value?.trim().toLowerCase()
        if (answerText && answerSet.has(answerText)) {
          return { duplicateAnswers: true }
        }
        answerSet.add(answerText)
      }
      return null
    }
  }
}
