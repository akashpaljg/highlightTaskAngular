import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CoreService } from 'src/app/core.service';
import { IOptions } from 'src/app/shared/interface';

@Component({
  selector: 'highlight-correct',
  templateUrl: './highlight-correct.component.html',
  styleUrls: ['./highlight-correct.component.css']
})
export class HighlightCorrectComponent implements OnInit {
  _selectors: IOptions[] | null = null;
  private _visible:true|false = false;
  isChecked:true|false = false;
  isValueSelected:true|false = false;
  isDisableSelect:boolean = true;
  visible:boolean = false;
  indeterminate:boolean = false;


  


  constructor(private service:CoreService) {
   
  }

  ngOnInit(): void {
    this.service.getOptions().subscribe((value)=>{
      if(!value){return;}
      this._selectors = value.map(item => ({ ...item }));
      this.isValueSelected = true;
      this.updateIsChecked();
    })
    this.service.getVisibility().subscribe((value)=>{
      this.visible = value;
    })
    console.log("Recieved at correct");
    console.log(this._selectors);
    this.updateIsChecked();
  }


  toggleSelection(index: number): void {
    console.log(this._selectors)
    if (this._selectors && this._selectors[index]) {
      const item = this._selectors[index];
       
        if (item && item.isSelected) {
          item.isCorrect = !item.isCorrect;
        }
        this.updateIsChecked();
        this.handleCorrectClick();
        this.service.setOptions(this._selectors);
    }
  }

  // Checked Correct answers
  onCheck():void{
    this.isChecked = !this.isChecked;
    if(this.isChecked){
      this.setSelection();
    }else{
      this.clearSelection();
    }
  }

  setSelection():void{
    if(!this._selectors){return;}
    this._selectors
    .filter(w => w.word.trim() !== '') 
    .filter(w=>w.isSelected === true) 
    .map(w => w.isCorrect = true);
    this.service.setOptions(this._selectors);
  }

  clearSelection():void{
    if(!this._selectors){return;}
    this._selectors
    .filter(w => w.word.trim() !== '')  
    .map(w => w.isCorrect=false);
    this.service.setOptions(this._selectors);
  }

  updateIsChecked(): void {
    if (!this._selectors) return;
  
    const selectedWords = this._selectors
      .filter(w => w.word.trim() !== '')  // Ignore whitespace-only entries
      .filter(w => w.isSelected === true); // Only consider selected words
  
    // If no words are selected, isChecked should be false
    this.isChecked = selectedWords.length > 0 && selectedWords.every(w => w.isCorrect);
    this.indeterminate = this.isChecked ? false:this.updateIndeterminateState();
    this.isDisableSelect =  selectedWords.length > 0;
  
    console.log(`Is Checked: ${this.isChecked}`);
  }


  updateIndeterminateState():boolean{
    return (this._selectors && this._selectors.length > 0) ? 
    this._selectors
    .filter(w => w.word.trim() !== '')  
    .some(w => w.isCorrect)
    :
    false;
  }
  handleCorrectClick():void{
    this.service.setValidateSelect(!this.isDisableSelect);
  }
  
  
  
}
