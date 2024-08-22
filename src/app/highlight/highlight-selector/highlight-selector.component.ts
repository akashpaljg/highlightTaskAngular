import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IOptions } from 'src/app/shared/interface';

@Component({
  selector: 'highlight-selector',
  templateUrl: './highlight-selector.component.html',
  styleUrls: ['./highlight-selector.component.css']
})

export class HighlightSelectorComponent implements OnInit {
  private _originalSelectors: IOptions[] = [];
  private _currentSelectors: IOptions[] = [];
  private _visibile:true|false = false;
  private _concateWord: true | false = false;
  isChecked:true|false = false;

  @Input()
  set selectors(value: IOptions[] | null) {
    if (value) {
      this._originalSelectors = value.map(item => ({ ...item }));
      this._currentSelectors = value.map(item => ({ ...item }));
      console.log(this._currentSelectors);
      this.updateIsChecked();
    }
    
    console.log('Options received:', this._currentSelectors);
  }

  get selectors(): IOptions[] | null {
    return this._currentSelectors;
  }

  @Input()
  set concateWord(value: true | false) {
    this._concateWord = value;
  }

  get concateWord(): true | false {
    return this._concateWord;
  }

  @Input()
  set visible(value: true|false){
    this._visibile = value;
  }

  get visible():true|false{
    return this._visibile;
  }

  @Output() options: EventEmitter<IOptions[] | null> = new EventEmitter<IOptions[] | null>();

  constructor() {}

  ngOnInit(): void {
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
    this.options.emit(this._currentSelectors);
  
  }

  onOptionClick(index: number): void {
    if (this._currentSelectors && this._currentSelectors[index]) {
      this.toggleSelection(index);
    }
  }

  updateSelectors(): void {
    if (!this._currentSelectors) return;

    let newSelectors: IOptions[] = [];
    let currentGroup: IOptions[] = [];

    for (let wordState of this._currentSelectors) {
      if (wordState.isSelected) {
        // If the word is selected, add it to the current group
        currentGroup.push(wordState);
      } else {
        // If the word is not selected, merge the current group if it's not empty,
        // then add the unselected word as a standalone item
        if (currentGroup.length > 0) {
          newSelectors.push(this.mergeWordStates(currentGroup));
          currentGroup = [];
        }
        newSelectors.push(wordState);
      }
    }

    // After the loop, merge any remaining selected words
    if (currentGroup.length > 0) {
      newSelectors.push(this.mergeWordStates(currentGroup));
    }

    console.log(newSelectors);

    // Update the _currentSelectors with the new selectors
    this._currentSelectors = newSelectors;
  }

  mergeWordStates(group: IOptions[]): IOptions {
    return {
      word: group.map(w => w.word).join(' '),
      isSelected: true,
      isCorrect: group.every(w => w.isCorrect)
    };
  }

  getOriginalWords(mergedWord: string): IOptions[] {
    const words = mergedWord.split(/(\s+)/)
    .map(word => word.trim())
    .filter(word => word.length > 0);

    return words.map(word => {
      const originalWord = this._originalSelectors.find(w => w.word === word);
      return {
        word: word,
        isSelected: false,
        isCorrect: originalWord ? originalWord.isCorrect : false
      };
    });
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

    this.options.emit(this._currentSelectors);
  }

  clearSelection():void{
    this._currentSelectors
    .filter(w => w.word.trim() !== '')  
    .map(w => {w.isSelected = false;w.isCorrect=false;});
    this.options.emit(this._currentSelectors);
  }

  updateIsChecked():void{
    this.isChecked = this._currentSelectors.length > 0 ? 
    this.isChecked = this._currentSelectors
    .filter(w => w.word.trim() !== '')  
    .every(w => w.isSelected)
    :
    false;
  }
  
}