import {Routes} from "@angular/router";
import {GroupComponent} from "./group.component";

export const GROUP_ROUTES: Routes = [{
  path: '',
  component: GroupComponent,
  children: [
    {path: '', redirectTo: 'chat', pathMatch: 'full' },
    {path: 'chat', loadComponent: () => import('./group-main/chat/chat.component').then(m => m.ChatComponent)},
    {path: 'quiz/:quizId', loadComponent: () => import('./group-main/quiz/quiz.component').then(m => m.QuizComponent)}
  ]}
];
