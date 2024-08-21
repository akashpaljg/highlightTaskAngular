import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path:"",pathMatch:"full",redirectTo:"/highlight"},
  {path:"highlight",pathMatch:"full",redirectTo:"/highlight"},
  {path:"preview",pathMatch:"full",redirectTo:"/preview"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
