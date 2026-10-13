import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home/home.page';
const routes: Routes = [
  { path: '', component: HomePage, data: { view: 'dashboard' } },
  { path: 'lessons', component: HomePage, data: { view: 'lessons' } },
  { path: 'quizzes', component: HomePage, data: { view: 'quizzes' } },
  { path: 'progress', component: HomePage, data: { view: 'progress' } },
  { path: '**', redirectTo: '' },
];
@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
