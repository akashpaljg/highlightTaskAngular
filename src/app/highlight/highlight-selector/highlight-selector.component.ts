import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CoreService } from 'src/app/core.service';
import { IOptions } from 'src/app/shared/interface';

@Component({
  selector: 'highlight-selector',
  templateUrl: './highlight-selector.component.html',
  styleUrls: ['./highlight-selector.component.css']
})

export class HighlightSelectorComponent implements OnInit {
  private _originalSelectors: IOptions[] = [];
  _currentSelectors: IOptions[] = [];
  visible:boolean = false;
  private _concateWord: true | false = false;
  isChecked:true|false = false;
  validateSelect:boolean = false;

  indeterminate:boolean = false;
 

 


  constructor(private service:CoreService) {
    
  }

  ngOnInit(): void {
    this.service.validateSelect.subscribe((value)=>{
      this.validateSelect = value;
    });
    this.service.getOptions().subscribe((value)=>{
      this._originalSelectors = value.map(item => ({ ...item }));
      this._currentSelectors = value.map(item => ({ ...item }));
      console.log('Options received:', this._currentSelectors);
      this.updateIsChecked();
    })
    this.service.getVisibility().subscribe((value)=>{
      this.visible = value;
    })
    this.service.getConcateWords().subscribe((value)=>{
      this._concateWord = value;
    })
    this.updateIsChecked();
  }

  toggleSelection(index: number): void {
    if (index < 0 || index >= this._currentSelectors.length) return;

    const currentWord = this._currentSelectors[index];
    if (currentWord.isSelected) {
      // If the word is currently selected, we need to split it
      // if(this._concateWord){
      //   const originalWords = this.getOriginalWords(currentWord.word);
      //   this._currentSelectors.splice(index, 1, ...originalWords);
      // }else{
        const item = this._currentSelectors[index].word.trim();
        this._currentSelectors[index].isSelected = item.length > 0 ? !this._currentSelectors[index].isSelected : false;
        this._currentSelectors[index].isCorrect = this._currentSelectors[index].isSelected ? this._currentSelectors[index].isCorrect : false;

      // }

    } else {
      // If the word is not selected, just toggle its state
      this._currentSelectors[index].isSelected = !this._currentSelectors[index].isSelected;
    }

    // confused with word selection.
    // if (this._concateWord) {
      // this.updateSelectors();
    // }
    // this.isValueSelectedFunc();
    this.updateIsChecked();
    this.service.setOptions(this._currentSelectors);
  
  }

  onOptionClick(index: number): void {
    if (this._currentSelectors && this._currentSelectors[index]) {
      this.toggleSelection(index);
    }
  }



  get currentSelectors(): IOptions[] {
    return this._currentSelectors;
  }

  onCheck():void{
    this.isChecked = !this.isChecked;
    if(this.isChecked){
      this.setSelection();
    }else{
      this.clearSelection();
    }
  }

  setSelection():void{
    this._currentSelectors
    .filter(w => w.word.trim() !== '')  
    .map(w => w.isSelected = true);
    this.service.setOptions(this._currentSelectors);
  }

  clearSelection():void{
    this._currentSelectors
    .filter(w => w.word.trim() !== '')  
    .map(w => {w.isSelected = false;w.isCorrect=false;});
    this.service.setOptions(this._currentSelectors);
  }

  updateIsChecked():void{
    this.isChecked = this._currentSelectors.length > 0 ? 
    this.isChecked = this._currentSelectors
    .filter(w => w.word.trim() !== '')  
    .every(w => w.isSelected)
    :
    false;
    this.indeterminate = this.isChecked ? false:this.updateIndeterminateState();
  }

  updateIndeterminateState():boolean{
    return this._currentSelectors.length > 0 ? 
    this._currentSelectors
    .filter(w => w.word.trim() !== '')  
    .some(w => w.isSelected)
    :
    false;
  }
  
}