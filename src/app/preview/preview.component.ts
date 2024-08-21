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

  bgColor:boolean[] = [];

  constructor(private service: CoreService) {}

  ngOnInit(): void {
    this.completeQuestion = this.service.getCompleteQuestion();
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
}
