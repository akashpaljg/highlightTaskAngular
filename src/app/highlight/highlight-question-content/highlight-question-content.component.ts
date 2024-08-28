import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/core.service';
import { IOptions, IQuestion } from 'src/app/shared/interface';

@Component({
  selector: 'highlight-question-content',
  templateUrl: './highlight-question-content.component.html',
  styleUrls: ['./highlight-question-content.component.css']
})
export class HighlightQuestionContentComponent implements OnInit {

    question: string = "";
    textPhrase: string = "";
    answerType: string = "";
    options: IOptions[] | null = null;
    isVisible: boolean = false;
    customType:true|false = false;
    totalCorrectAnswers:number[]|undefined = [0];
  
    completeQuestion:IQuestion = {
      question : "",
      textPhrase: "",
      options: [],
      answersCount:0
    };
  
    constructor(private router:Router,private service:CoreService) {
      
    }
  
    ngOnInit(): void {
        this.service.getOptions().subscribe((value)=>{
          this.options = value;
        });
      
      
      this.service.getTotalCorrectAnswer().subscribe((value:number[])=>{
        this.totalCorrectAnswers = value;
      });
      this.service.getVisibility().subscribe((value)=>{
        this.isVisible = value;
      })
      this.service.setIsPreview(false);
    }
  
    navigateToPreview(){
      console.log("Clicked on Preview");
      this.router.navigate(['/preview'])
    }
  
   
  
    getSelector(textPhrase: string, answerType: string): IOptions[] | null {
      
      this.service.setConcateWords(false);
      this.customType = false;
  
      if (answerType === "word") {
        this.service.setConcateWords(true);
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
  
    getWordOptions(textPhrase: string): IOptions[] {
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
  
    getSentenceOptions(textPhrase: string): IOptions[] {
      // Split the text by paragraphs first
      const paragraphs: string[] = textPhrase.split(/\n+/);
    
      let sentenceOptions: IOptions[] = [];
    
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
  
    getParagraphOptions(textPhrase: string): IOptions[] {
      // Split the text into paragraphs using one or more newline characters as the delimiter
      const paragraphOptions: string[] = textPhrase.split(/\n+/);
    
      // Map each paragraph into the required structure
      let result: IOptions[] = [];
    
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
  
    getCustomOptions(textPhrase: string): IOptions[] | null {
      // const customOptions: IOptions[] = [];
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
        if(this.options) this.service.setOptions(this.options);
        
        this.completeQuestion.question = this.question;
        this.completeQuestion.textPhrase = this.textPhrase;
        this.completeQuestion.options = this.options?this.options:[];

        this.service.setCompleteQuestion(this.completeQuestion);
        this.service.setVisibility(true);
      } else {
        this.service.setIsPreview(false);
        this.service.setVisibility(false);
      }
      
  
      
    
      console.log(`${this.question} ${this.textPhrase} ${this.answerType}`)
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

    naviagteToQuestionProperties():void{
      this.router.navigate(['highlight/questionProperties']);
    }

}
