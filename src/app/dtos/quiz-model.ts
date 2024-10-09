import {QuestionsModel} from "./questions-model";

export interface QuizModel {
  name : string | null,
  questions : QuestionsModel[]
}
