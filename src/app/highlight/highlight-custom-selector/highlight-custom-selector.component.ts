import { Component, OnInit, Input, EventEmitter, Output, Renderer2, ElementRef, OnDestroy } from '@angular/core';
import { CoreService } from 'src/app/core.service';
import { IOptions } from 'src/app/shared/interface';


@Component({
  selector: 'highlight-custom-selector',
  templateUrl: './highlight-custom-selector.component.html',
  styleUrls: ['./highlight-custom-selector.component.css']
})
export class HighlightCustomComponent implements OnInit,OnDestroy {
  private _originalSelectors: IOptions[] = [];
  wordStates: IOptions[] = [];
  isValueSelected:true|false = false;
  visible:boolean = false;
  validateSelect:boolean = false;
  removeListener:any|null = null;

  constructor(private renderer: Renderer2, private el: ElementRef,private service:CoreService) {
   
  }

  ngOnInit(): void {
    this.initializeEventListeners();
    this.service.getVisibility().subscribe((value)=>{
      this.visible = value;
    })

    this.service.getOptions().subscribe((value)=>{
      console.log("Received at Highlight custom component");
      console.log(value);
      
      this.wordStates = value ? value.map(item => ({ ...item })) : [];
      this._originalSelectors = value ? value.map(item => ({ ...item })) : [];
    })

    this.service.getValidateSelect().subscribe((value)=>{
      this.validateSelect = value;
    })
  }

  // cleanup function
  ngOnDestroy():void{
    if(this.removeListener){
      this.removeListener();
    }
  }

  initializeEventListeners(): void {
    const container = this.el.nativeElement.querySelector('.highlight-container');
    if (container) {
      this.removeListener = this.renderer.listen(container, 'mouseup', (e: MouseEvent) => this.handleSelection(e));
    }
  }

  handleSelection(e: MouseEvent): void {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    const container = this.el.nativeElement.querySelector('.highlight-container');
    const startWord = this.getWordIndex(container, range.startContainer, range.startOffset);
    const endWord = this.getWordIndex(container, range.endContainer, range.endOffset);

    this.updateWordStates(startWord, endWord);
  }

  getWordIndex(container: Node, targetNode: Node, targetOffset: number): number {
    const spans = this.el.nativeElement.querySelectorAll('span');
    for (let i = 0; i < spans.length; i++) {
      if (spans[i].contains(targetNode)) {
        return i;
      }
    }
    return -1;
  }

  private updateWordStates(startWord: number, endWord: number): void {
    for (let i = startWord; i <= endWord; i++) {
      this.wordStates[i].isSelected = !this.wordStates[i].isSelected;
      if (!this.wordStates[i].isSelected) {
        this.wordStates[i].isCorrect = false;
      }
    }
    this.updateSelectors();
    this.emitSelectors();
    this.isValueSelectedFunc();
  }

  updateSelectors(): void {
    if (!this.wordStates) { return; }
  
    let newSelectors: IOptions[] = [];
    let currentGroup: IOptions[] = [];
  
    for (let wordState of this.wordStates) {
      if (wordState.isSelected) {
        currentGroup.push(wordState);
      } else {
        if (currentGroup.length > 0) {
          newSelectors.push(this.mergeWordStates(currentGroup));
          currentGroup = [];
        }
        newSelectors.push(wordState);
      }
    }
  
    if (currentGroup.length > 0) {
      newSelectors.push(this.mergeWordStates(currentGroup));
    }
  
    this.wordStates = newSelectors;
  }

  mergeWordStates(group: IOptions[]): IOptions {
    return {
      word: group.map(w => w.word).join(' '),
      isSelected: group[0].isSelected,
      isCorrect: group[0].isCorrect
    };
  }

  emitSelectors(): void {
    this.service.setOptions([...this.wordStates]);
  }

  toggleSelection(index: number): void {
    if (index < 0 || index >= this.wordStates.length) return;

    const currentWord = this.wordStates[index];
    if (currentWord.isSelected) {
      // If the word is currently selected, we need to split it
        const originalWords = this.getOriginalWords(currentWord.word);
        this.wordStates.splice(index, 1, ...originalWords);
      }else{
        this.wordStates[index].isSelected = !this.wordStates[index].isSelected;
        this.wordStates[index].isCorrect = this.wordStates[index].isSelected ? this.wordStates[index].isCorrect : false;
      } 
      this.emitSelectors();
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

  isValueSelectedFunc():void{
    this.wordStates.map((w)=>{
        if(w.isSelected){
          this.isValueSelected = true;
          return;
      }
    });
    this.isValueSelected = false;
  }

  /**
   * This will unselect all the selected values in custom section on clicking reset button
   * @returns 
   */
  resetClick(): void {
    const selectedStates = this.wordStates
        .filter(w => w.word.trim() !== '')
        .filter(w => w.isSelected);

    if (selectedStates.length === 0) {
        alert("No value is selected");
        return;
    }

    let updatedWordStates:any[] = [];

    this.wordStates.map((word, index) => {
        if (word.isSelected) {
            const originalWords = this.getOriginalWords(word.word);
            updatedWordStates.push(...originalWords);
        } else {
            updatedWordStates.push(word) 
        }
    }) 

    this.wordStates = updatedWordStates;

    this.emitSelectors();
}

}
