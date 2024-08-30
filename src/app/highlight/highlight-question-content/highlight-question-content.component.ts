import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/core.service';
import { IOptions, IQuestion } from 'src/app/shared/interface';

@Component({
  selector: 'highlight-question-content',
  templateUrl: './highlight-question-content.component.html',
  styleUrls: ['./highlight-question-content.component.css']
})
export class HighlightQuestionContentComponent implements OnInit ,AfterViewInit {

    question: string = "";
    textPhrase: string = "";
    answerType: string = "";
    options: IOptions[] | null = null;
    isVisible: boolean = false;
    customType:true|false = false;
    totalCorrectAnswers:number[] = [0];
    answerTypeArray:string[] = ["word","sentence","paragraph","custom"];
  
    completeQuestion:IQuestion = {
      question : "",
      textPhrase: "",
      answerType:"",
      options: [],
      answersCount:0
    };
  
    constructor(private router:Router,private service:CoreService,private el:ElementRef,private renderer:Renderer2) {
      
    }
  
    ngOnInit(): void {
      this.service.getCompleteQuestion().subscribe((value)=>{
        if(!value){return;}
        console.log(`Data Loaded: ${value.question} ${value.textPhrase}`)
        this.question = value.question;
        this.textPhrase = value.textPhrase;
        this.answerType = value.answerType;
        this.customType = this.answerType === "custom";
        this.adjustTextareaHeight();
      })

      this.service.getOptions().subscribe((value)=>{
          this.options = value;
      });
      
      
      this.service.getTotalCorrectAnswer().subscribe((value:number[])=>{
        this.totalCorrectAnswers = value;
      });

      this.service.getVisibility().subscribe((value)=>{
        this.isVisible = value;
      })
    }

    ngAfterViewInit(): void {
      this.adjustTextareaHeight();

    }

    private adjustTextareaHeight(): void {
      setTimeout(() => {
        let textarea = this.el.nativeElement.querySelectorAll('.textPhrase');
        textarea.forEach((t: any)=>{
          if (t) { 
            this.renderer.setStyle(t, 'height', 'auto');
            this.renderer.setStyle(t, 'height', `${t.scrollHeight}px`);
          } else {
            setTimeout(() => this.adjustTextareaHeight(), 500);
          }
        })
        
      }, 0);
    }

    
  
    navigateToPreview(){
      console.log("Clicked on Preview");
      this.router.navigate(['/preview'])
    }
  
   
  
    getSelector(textPhrase: string, answerType: string): IOptions[] | null {
      
      this.service.setConcateWords(answerType === "word");
      this.customType = answerType === "custom";

  
      switch (answerType) {
        case "word":
          return this.service.getWordOptions(textPhrase);
        case "sentence":
          return this.service.getSentenceOptions(textPhrase);
        case "paragraph":
          return this.service.getParagraphOptions(textPhrase);
        case "custom":
          return this.service.getWordOptions(textPhrase);
        default:
          return null;
      }
    }
  
  
    updateVisibility(): void {
      this.completeQuestion.question = this.question;
      this.completeQuestion.textPhrase = this.textPhrase;
      this.completeQuestion.answerType = this.answerType;

      console.log(`${this.question} ${this.textPhrase}`)

      if (this.question.trim().length > 0  && this.textPhrase.trim().length > 0 && this.answerType.trim().length > 0) {
        this.options = this.getSelector(this.textPhrase, this.answerType);

        // to update the correct answer count
        if(this.options) this.service.setOptions(this.options);
       
        console.log(`Update Visibility: ${this.question} ${this.textPhrase}`);
        
        this.completeQuestion.options = this.options?this.options:[];
        this.service.setCompleteQuestion(this.completeQuestion);

        this.service.setVisibility(true);
      } else {
        console.log(`Update Visibility: ${this.question} ${this.textPhrase}`);
        this.service.setCompleteQuestion(this.completeQuestion);
        this.service.setIsPreview(false);
        this.service.setVisibility(false);
      }
  
      console.log(`${this.question}`)
    }
  
  
    autoResize(): void {
      this.updateVisibility();
      this.adjustTextareaHeight();
    }
  
    onEnter(event: KeyboardEvent): void {
      if (event.key === 'Enter') {
        this.autoResize();
      }
    }

    naviagteToQuestionProperties():void{
      this.router.navigate(['highlight/questionProperties']);
    }

}
