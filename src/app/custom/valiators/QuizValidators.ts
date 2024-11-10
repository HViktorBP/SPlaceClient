import {AbstractControl, FormArray, ValidationErrors, ValidatorFn} from "@angular/forms";

/**
 * QuizValidators class provide different validators for quiz.
 */

export class QuizValidators {
  public static trueFalseSingleCorrectValidator(): ValidatorFn  {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const type = control.get('type')?.value;
      const answers = control.get('answers') as FormArray;

      if (type === '0') {
        const correctAnswersCount = answers.controls.filter((answer) => answer.get('status')?.value).length

        if (correctAnswersCount > 1) {
          return { multipleCorrectAnswers: true }
        }
      }
      return null
    }
  }

  public static questionsValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
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
}
