import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {QuizzesService} from "../../services/quizzes.service";
import {Injectable, OnDestroy} from "@angular/core";
import {Subscription} from "rxjs";

/**
 * QuizForm class provides the base functionality of the quiz forms
 */

@Injectable()
export class QuizForm implements OnDestroy {
  /**
   * Description: quiz's form
   */
  protected quizForm!: FormGroup
  protected dynamicControlSubscriptions: Subscription[] = [];

  constructor(protected quizzesService : QuizzesService,
              protected fb : FormBuilder) {}

  /**
   * Description: getter for questions in form.
   */
  get questions(): FormArray {
    return this.quizForm.get('questions') as FormArray
  }

  /**
   * Description: creates a new question in form.
   */
  createQuestion(): FormGroup {
    return this.fb.group({
      id: 0,
      question: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      type: [0, Validators.required],
      selectedAnswer: 0,
      answers: this.fb.array([]),
    }, { updateOn: "blur" }
    )
  }

  /**
   * Description: creates a new answer in form.
   */
  createAnswer(): FormGroup {
    const answerGroup = this.fb.group({
      id: 0,
      answer: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      status: [false]
      }, { updateOn: "blur" }
    )

    answerGroup.get('status')?.disable()

    const dynamicSubscription = answerGroup.get('answer')?.valueChanges.subscribe((value) => {
      if (!value || value === '') {
        answerGroup.get('status')?.disable()
      } else {
        answerGroup.get('status')?.enable()
      }
    })

    this.dynamicControlSubscriptions.push(dynamicSubscription!);

    return answerGroup
  }

  /**
   * Description: adds a new question to array of questions and sets validators on it.
   */
  addQuestion() {
    this.questions.push(this.createQuestion());
    this.quizzesService.setValidatorsForQuestions(this.quizForm)
  }

  /**
   * Description: adds a new answers to array of answers and sets validators on it.
   * @param {number} index - question's index
   */
  addAnswer(index: number) {
    this.getAnswers(index).push(this.createAnswer())
    this.quizzesService.setValidatorsForAnswers(this.questions.at(index) as FormGroup)
  }

  /**
   * Description: removes a question for from and resets the validators.
   * @param index
   */
  removeQuestion(index: number) {
    this.questions.removeAt(index);
    this.quizzesService.setValidatorsForQuestions(this.quizForm)
  }

  /**
   * Description: removes an answer for from and resets the validators.
   * @param {number} questionIndex - question's index
   * @param {number} answerIndex - answer's index
   */
  removeAnswer(questionIndex: number, answerIndex: number) {
    const questionFormGroup = this.questions.at(questionIndex) as FormGroup
    const selectedAnswer = questionFormGroup.get('selectedAnswer')?.value
    const answersArray = this.getAnswers(questionIndex)

    answersArray.removeAt(answerIndex);

    if (questionFormGroup.get('type')?.value === 0 && answerIndex == selectedAnswer) {
      questionFormGroup.get('selectedAnswer')?.setValue(0)
    }

    this.quizzesService.setValidatorsForAnswers(questionFormGroup);
  }

  /**
   * Description: getter for answers.
   * @param {number} index - question's index
   */
  getAnswers(index: number): FormArray {
    return this.questions.at(index).get('answers') as FormArray
  }

  /**
   * Description: adds a control named singleAnswer for the question of type SingleAnswer.
   * @param {number} index - question's index
   */
  addSingleAnswer(index: number) {
    const questionFormGroup = this.questions.at(index) as FormGroup;
    questionFormGroup.addControl('selectedAnswer', new FormControl(0))
  }

  /**
   * Description: remove control named singleAnswer from question.
   * @param {number} index - question's index
   */
  removeSingleAnswer(index: number) {
    const questionFormGroup = this.questions.at(index) as FormGroup;
    if (questionFormGroup.contains('selectedAnswer')) {
      questionFormGroup.removeControl('selectedAnswer')
    }
  }


  /**
   * Description: set's the status of selected answer to true and others to false when user sets a correct answer on question with thy type SingleAnswer
   * @param questionIndex - question's index
   * @param answerIndex - answer's index
   * @param questions -
   */
  onSingleAnswerSelection(questions : FormArray, questionIndex: number, answerIndex: number) {
    const questionFormGroup = questions.at(questionIndex) as FormGroup
    const answersArray = questionFormGroup.get('answers') as FormArray

    answersArray.controls.forEach((control, index) => {
      if (index !== answerIndex) {
        control.get('status')?.setValue(false);
      }
    })

    answersArray.at(answerIndex).get('status')?.setValue(true)
    questionFormGroup.get('selectedAnswer')?.setValue(answerIndex)
  }

  /**
   * Description: onCancel method resets quiz's form.
   */
  onCancel(): void {
    this.quizForm.reset()
  }

  ngOnDestroy() {
    this.dynamicControlSubscriptions.forEach(subscription => subscription.unsubscribe())
    this.quizForm.reset()
  }
}
