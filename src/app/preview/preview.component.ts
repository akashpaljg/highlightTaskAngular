import { Component, OnInit } from '@angular/core';
import { CoreService } from '../core.service';
import { IOptions, IQuestion } from '../shared/interface';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  completeQuestion: IQuestion | null = null;
  items:{isHover:boolean,item?:IOptions}[] = [];
  isChecking:true|false = false;

  bgColor:boolean[] = [];

  constructor(private service: CoreService) {}

  ngOnInit(): void {
    this.completeQuestion = this.service.getCompleteQuestion();
    this.initializeOptions();
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
  }

    
    toggleChecking():void{
      this.isChecking = !this.isChecking;
      if(!this.isChecking){
        this.initializeOptions();
      }
      
    }

    getItemClasses(item: any, isChecking: boolean): any {
      return {
        'highlight': (!isChecking && item.isHover) || item.item,
        'green': item.item && isChecking && item.item?.isCorrect,
        'red': item.item && isChecking && !item.item?.isCorrect
      };
    }
    
}
