import { Component, OnInit } from '@angular/core';
import { IQuestion } from '../shared/interface';
import { Router } from '@angular/router';
import { CoreService } from '../core.service';


@Component({
  selector: 'app-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css']
})
export class HighlightComponent implements OnInit {
  question: string = "";
  textPhrase: string = "";
  answerType: string = "";
  options: { word: string, isSelected: boolean, isCorrect: boolean }[] | null = null;
  isVisible: boolean = false;
  customType:true|false = false;
  totalCorrectAnswers:number[]|undefined = [0];
  collapseWord:true|false = false;
  isPreview:true|false = false;

  completeQuestion:IQuestion = {
    question : "",
    textPhrase: "",
    options: [],
    answersCount:0
  };

  constructor(private router:Router,private service:CoreService) {
    
  }

  ngOnInit(): void {
  }

  navigateToPreview(){
    console.log("Clicked on Preview");
    this.router.navigate(['/preview'])
  }

 

  getSelector(textPhrase: string, answerType: string): { word: string, isSelected: boolean, isCorrect: boolean }[] | null {
    
    this.collapseWord = false;
    this.customType = false;

    if (answerType === "word") {
      this.collapseWord = true;
      return this.getWordOptions(textPhrase);
    } else if (answerType === "sentence") {
      return this.getSentenceOptions(textPhrase);
    } else if(answerType === "paragraph"){
      return this.getParagraphOptions(textPhrase);
    } else if(answerType === "custom"){
      this.customType = true;
      return this.getWordOptions(textPhrase);
    }
    return null;
  }

  getWordOptions(textPhrase: string): { word: string, isSelected: boolean, isCorrect: boolean }[] {
    // Return an empty array if textPhrase is empty, null, or undefined
    if (!textPhrase || textPhrase.trim() === "") {
      return [];
    }
  
    // Split the text into paragraphs
    const paragraphs = textPhrase.split(/\n+/);
  
    // Process each paragraph
    const processedParagraphs = paragraphs.map(paragraph => {
      const wordOptions: string[] = paragraph
        .split(/(\s+)/)
        .map(word => word.trim())
        .filter(word => word.length > 0);
  
      return wordOptions.map((word) => ({
        word: word,
        isSelected: false,
        isCorrect: false
      }));
    });
  
    // Flatten the array of paragraphs, inserting a newline object between paragraphs
    return processedParagraphs.reduce((acc, paragraph, index) => {
      if (index > 0) {
        acc.push({ word: '\n', isSelected: false, isCorrect: false });
      }
      return acc.concat(paragraph);
    }, []);
  }

  getSentenceOptions(textPhrase: string): { word: string, isSelected: boolean, isCorrect: boolean }[] {
    // Split the text by paragraphs first
    const paragraphs: string[] = textPhrase.split(/\n+/);
  
    let sentenceOptions: { word: string, isSelected: boolean, isCorrect: boolean }[] = [];
  
    paragraphs.forEach(paragraph => {
      // Use a regular expression to split the paragraph into sentences, keeping the full stops
      const sentences = paragraph.match(/[^.!?]+[.!?]*/g) || []; 
  
      sentences.forEach(sentence => {
        sentenceOptions.push({
          word: sentence.trim(),
          isSelected: false,
          isCorrect: false
        });
      });
  
      // Add a paragraph separator if needed (optional)
      sentenceOptions.push({
        word: '\n', // Represents a paragraph break
        isSelected: false,
        isCorrect: false
      });
    });
  
    // Remove the last paragraph separator if it's not needed
    if (sentenceOptions[sentenceOptions.length - 1].word === '\n') {
      sentenceOptions.pop();
    }
  
    return sentenceOptions;
  }

  getParagraphOptions(textPhrase: string): { word: string, isSelected: boolean, isCorrect: boolean }[] {
    // Split the text into paragraphs using one or more newline characters as the delimiter
    const paragraphOptions: string[] = textPhrase.split(/\n+/);
  
    // Map each paragraph into the required structure
    let result: { word: string, isSelected: boolean, isCorrect: boolean }[] = [];
  
    paragraphOptions.forEach((paragraph, index) => {
      // Trim the paragraph to remove leading/trailing whitespace
      paragraph = paragraph.trim();
  
      if (paragraph.length > 0) {
        result.push({
          word: paragraph,
          isSelected: false,
          isCorrect: false
        });
  
        // Add a separator for the paragraph, using '\n' to represent the separation
        if (index < paragraphOptions.length - 1) {
          result.push({
            word: '\n', // This represents a paragraph break
            isSelected: false,
            isCorrect: false
          });
        }
      }
    });
  
    return result;
  }

  getCustomOptions(textPhrase: string): { word: string, isSelected: boolean, isCorrect: boolean }[] | null {
    // const customOptions: { word: string, isSelected: boolean, isCorrect: boolean }[] = [];
    this.customType = true;
    // alert(this.customType);
    return [{
      word:textPhrase,
      isSelected:false,
      isCorrect:false
    }];
  }

  updateVisibility(): void {
    if (this.question !== "" && this.textPhrase !== "" && this.answerType !== "") {
      this.options = this.getSelector(this.textPhrase, this.answerType);
      // to update the correct answer count
      this.getCorrectAnswer(this.options);
      this.completeQuestion.question = this.question;
      this.completeQuestion.textPhrase = this.textPhrase;
      this.isVisible = true;  
    } else {
      this.isPreview = false;
      this.isVisible = false;
    }

    
  
    console.log(`${this.question} ${this.textPhrase} ${this.answerType}`)
  }

  editOptions(options: { word: string, isSelected: boolean, isCorrect: boolean }[] | null) {
    this.options = options;
    this.completeQuestion.options = options ? options : [];
    this.getCorrectAnswer(options);
    this.isPreview = this.checkPreview(this.completeQuestion);
    
    this.service.setcompleteQuestion(this.completeQuestion);
    console.log("Service got the data");

    console.log(`Preview: ${this.isPreview}`);
  }

  getCorrectAnswer(options:any|null): void{
    let total = 0;
    if(!options){return;}
    options?.map((o:{ word: string, isSelected: boolean, isCorrect: boolean })=>{
      total = o.isCorrect ? total+1:total;
    });
    this.totalCorrectAnswers = Array.from({ length: total + 1 }, (_, i) => i);
    this.completeQuestion.answersCount = this.totalCorrectAnswers.length;

    // this.totalCorrectAnswers.reverse();
  }
  

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; 
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.autoResize(event);
    }
  }

  checkPreview(completeQuestion:IQuestion):true|false{
    if(completeQuestion.question.trim().length === 0 && completeQuestion.textPhrase.trim().length === 0){
      return false;
    }
    const selectedCount = completeQuestion.options.filter((o)=>o.isSelected).length;
    const correctCount = completeQuestion.options.filter((o)=>o.isCorrect).length;
    return selectedCount > 0 && correctCount > 0;
  }

  
}
