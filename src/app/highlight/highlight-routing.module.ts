import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HighlightComponent } from './highlight.component';
import { PreviewComponent } from '../preview/preview.component';

const routes: Routes = [
  {path:"highlight",component:HighlightComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HighlightRoutingModule { }
