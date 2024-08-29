import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CapitalizePipe } from './capitalize.pipe';

@NgModule({
  declarations: [
    CapitalizePipe
  ],
  imports: [
    BrowserModule
  ],
  exports:[CapitalizePipe]
})
export class SharedModule { }
