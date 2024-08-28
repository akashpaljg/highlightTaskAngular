import { Component, OnInit } from '@angular/core';
import { IOptions, IQuestion } from '../shared/interface';
import { Router } from '@angular/router';
import { CoreService } from '../core.service';

@Component({
  selector: 'app-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css']
})
export class HighlightComponent implements OnInit {
  isVisible: boolean = false;

  constructor(private router:Router,private service:CoreService) {
   
  }

  ngOnInit(): void {
    this.service.getVisibility().subscribe((value)=>{
      this.isVisible = value;
    })
  }
  
}
