import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HighlightRoutingModule } from './highlight-routing.module';
import { HighlightComponent } from './highlight.component';
import { FormsModule } from '@angular/forms';
import { HighlightSelectorComponent } from './highlight-selector/highlight-selector.component';
import { HighlightCorrectComponent } from './highlight-correct/highlight-correct.component';
import { HighlightMainComponent } from './highlight-main/highlight-main.component';
import { HighlightCustomComponent } from './highlight-custom-selector/highlight-custom-selector.component';
import { SharedModule } from '../shared/shared.module';
import { HighlightSaveAndPreviewComponent } from './highlight-save-preview/highlight-save-preview.component';

@NgModule({
  declarations: [
    HighlightComponent,
    HighlightSelectorComponent,
    HighlightCorrectComponent,
    HighlightMainComponent,
    HighlightSaveAndPreviewComponent,
    HighlightCustomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    SharedModule,
    HighlightRoutingModule
  ]
})
export class HighLightModule { }
