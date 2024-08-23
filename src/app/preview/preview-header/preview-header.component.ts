import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview-header',
  templateUrl: './preview-header.component.html',
  styleUrls: ['./preview-header.component.css']
})
export class PreviewHeaderComponent implements OnInit {

  constructor(private router:Router) {}

  ngOnInit(): void {
 
  }

  onExitPreview(){
    this.router.navigate(['./highlight'])
  }

    
}
