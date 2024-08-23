import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SharedModule } from '../shared/shared.module';
import { PreviewComponent } from './preview.component';
import { PreviewRoutingModule } from './preview-routing.module';
import { PreviewHeaderComponent } from './preview-header/preview-header.component';
import { PreviewQuestionsComponent } from './preview-questions/preview-questions.component';

@NgModule({
  declarations: [
    PreviewComponent,
    PreviewHeaderComponent,
    PreviewQuestionsComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    PreviewRoutingModule
  ]
})
export class PreviewModule { }
