import {AbstractControl, FormArray, ValidationErrors, ValidatorFn} from "@angular/forms";

export class QuizValidators {
  public static trueFalseSingleCorrectValidator(): ValidatorFn  {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const type = control.get('type')?.value;
      const answers = control.get('answers') as FormArray;

      if (type === '0') {
        const correctAnswersCount = answers.controls.filter((answer) => answer.get('status')?.value).length;

        if (correctAnswersCount > 1) {
          return { multipleCorrectAnswers: true };
        }
      }
      return null;
    };
  }

  public static questionsValidator(formArray: AbstractControl): ValidationErrors | null {
    let hasError = false;

    if (formArray instanceof FormArray) {
      formArray.controls.forEach((questionControl) => {
        const answers = questionControl.get('answers') as FormArray;
        const atLeastOneCorrect = answers.controls.some(answer => answer.get('status')?.value === true);

        if (!atLeastOneCorrect) {
          hasError = true;
        }
      });
    }

    return hasError ? { atLeastOneCorrect: true } : null;
  }

  public static quizHasQuestionsValidator(): ValidatorFn {
    return (formArray: AbstractControl): ValidationErrors | null => {
      if (formArray instanceof FormArray) {
        if (formArray.length === 0) {
          return { noQuestions: true };
        }
      }
      return null;
    };
  }
}
