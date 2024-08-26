import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HighlightComponent } from './highlight.component';
import { PreviewComponent } from '../preview/preview.component';
import { HighlightQuestionContentComponent } from './highlight-question-content/highlight-question-content.component';
import { HighlightQuestionPropertiesComponent } from './highlight-question-properties/highlight-question-properties.component';

const routes: Routes = [
  {path:"highlight",component:HighlightComponent,children:[
    {
      path:"questionContent",component:HighlightQuestionContentComponent,
    },
    {
      path:"questionProperties",component:HighlightQuestionPropertiesComponent,
    }
    
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HighlightRoutingModule { }
