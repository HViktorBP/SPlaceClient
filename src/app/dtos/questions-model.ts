import {AnswerModel} from "./answer-model";

export interface QuestionsModel {
  question : string | null,
  answers : AnswerModel[]
}
