import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'src/app/core.service';
import { IOptions } from 'src/app/shared/interface';

@Component({
  selector: 'highlight-save-preview',
  templateUrl: './highlight-save-preview.component.html',
  styleUrls: ['./highlight-save-preview.component.css']
})

export class HighlightSaveAndPreviewComponent implements OnInit {
    isPreview:boolean = false;

    constructor(private service:CoreService,private router:Router){
       
    }

    ngOnInit(): void {
        this.service.getIsPreview().subscribe((value:boolean)=>{
            this.isPreview = value;
        })
    }

    navigateToPreview(){
        console.log("Clicked on Preview");
        this.router.navigate(['/preview'])
    }
  
}