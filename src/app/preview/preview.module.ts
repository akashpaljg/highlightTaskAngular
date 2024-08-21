import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { SharedModule } from '../shared/shared.module';
import { PreviewComponent } from './preview.component';
import { PreviewRoutingModule } from './preview-routing.module';

@NgModule({
  declarations: [
    PreviewComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    PreviewRoutingModule
  ]
})
export class PreviewModule { }
