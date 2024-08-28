import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'highlight-question-properties',
  templateUrl: './highlight-question-properties.component.html',
  styleUrls: ['./highlight-question-properties.component.css']
})
export class HighlightQuestionPropertiesComponent implements OnInit {
  showProperty:boolean = true;
  showStandardSet:boolean = false;
  constructor(private router:Router){}

  ngOnInit(): void {
    
  }

  /**
   * It is used to handle the visibility of properties
   */
  handleVisibility():void{
    this.showProperty = !this.showProperty;
  }

  /**
   * It is used to handle the visibility of Standard set
   */
  handleStandardSet():void{
    this.showStandardSet = !this.showStandardSet;
  }

  navigateToQuestionContent(){
    this.router.navigate(['highlight/questionContent']);
  }

}
