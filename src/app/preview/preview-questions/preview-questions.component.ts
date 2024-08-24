import { Component, OnInit } from '@angular/core';
import { CoreService } from 'src/app/core.service';
import { IOptions, IQuestion } from 'src/app/shared/interface';

@Component({
  selector: 'app-preview-questions',
  templateUrl: './preview-questions.component.html',
  styleUrls: ['./preview-questions.component.css']
})
export class PreviewQuestionsComponent implements OnInit {
  completeQuestion: IQuestion | null = null;
  items:{isHover:boolean,item?:IOptions}[] = [];
  isChecking:true|false = false;
  isCheckingEnabled:boolean = false;
  showCorrectAnswer:boolean = false;

  bgColor:boolean[] = [];

  constructor(private service: CoreService) {}

  ngOnInit(): void {
    this.completeQuestion = this.service.getCompleteQuestion();
    this.initializeOptions();
    this.checkingEnabled();
    console.log(this.completeQuestion?.options);
  }

  initializeOptions(){
    this.items = [];
    this.completeQuestion?.options.map((q)=>{
      this.items.push({isHover:false});
    })
  }

  onMouseOver(item: any,i:number): void {
    if(item.isSelected){
      this.items[i].isHover = true;
    }else{
      this.items[i].isHover = false;
    }
  }

  onMouseOut(i:number): void { 
    this.items[i].isHover = false;
  }

  handleSelection(item:any,i:number){
    if(this.items[i].item){
      this.items[i].item = undefined;
    }else{
      this.items[i].item = item;
    }
    this.checkingEnabled();
  }

  checkingEnabled(){
    let check = false;
    this.items.map((item)=>{
      if(item.item){
        check = true;
      }
    })
    this.isCheckingEnabled = check;
  }

  handleShowCorrectAnswer(){
    this.showCorrectAnswer = !this.showCorrectAnswer;
  }

    
    toggleChecking():void{
      this.isChecking = !this.isChecking;
      if(!this.isChecking){
        this.initializeOptions();
        this.checkingEnabled();
        this.handleShowCorrectAnswer();
      }
      
    }

    
}
