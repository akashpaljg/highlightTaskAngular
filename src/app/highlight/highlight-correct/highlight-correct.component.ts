import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CoreService } from 'src/app/core.service';
import { IOptions } from 'src/app/shared/interface';

@Component({
  selector: 'highlight-correct',
  templateUrl: './highlight-correct.component.html',
  styleUrls: ['./highlight-correct.component.css']
})
export class HighlightCorrectComponent implements OnInit {
  private _selectors: IOptions[] | null = null;
  private _visible:true|false = false;
  isChecked:true|false = false;
  isValueSelected:true|false = false;
  isDisableSelect:boolean = true;

  @Input()
  set selectors(value: IOptions[] | null) {
    // if(this._selectors !== value){
    if(!value){return;}
    this._selectors = value.map(item => ({ ...item }));
    this.isValueSelected = true;
    this.updateIsChecked();
    console.log('Options received at correct side:', this._selectors);
    // }
  }

  get selectors(): IOptions[] | null {
    return this._selectors;
  }

  @Input()
  set visible(value:true|false){
    this._visible = value;
  }

  get visible():true|false{
    return this._visible;
  }

  @Output() options: EventEmitter<IOptions[] | null> = new EventEmitter<IOptions[] | null>();


  constructor(private service:CoreService) {}

  ngOnInit(): void {
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
      this.options.emit(this._selectors);
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

    this.options.emit(this._selectors);
  }

  clearSelection():void{
    if(!this._selectors){return;}
    this._selectors
    .filter(w => w.word.trim() !== '')  
    .map(w => w.isCorrect=false);
    this.options.emit(this._selectors);
  }

  updateIsChecked(): void {
    if (!this._selectors) return;
  
    const selectedWords = this._selectors
      .filter(w => w.word.trim() !== '')  // Ignore whitespace-only entries
      .filter(w => w.isSelected === true); // Only consider selected words
  
    // If no words are selected, isChecked should be false
    this.isChecked = selectedWords.length > 0 && selectedWords.every(w => w.isCorrect);
    this.isDisableSelect =  selectedWords.length > 0;
  
    console.log(`Is Checked: ${this.isChecked}`);
  }

  handleCorrectClick():void{
    this.service.setValidateSelect(!this.isDisableSelect);
  }
  
  
  
}
