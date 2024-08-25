import { Component, OnInit } from '@angular/core';
import { INavLinks } from './shared/interface';
@Component({
  selector: 'app-root',
  templateUrl:'./app.component.html',
  styleUrls:['./app.component.css']
})
export class AppComponent implements OnInit {
  navLinks:INavLinks[] = [{title:'Content',url:'Content',isActive:true},{title:'Users',url:'Users',isActive:false},{title:'Admin',url:'Admin',isActive:false}];
  constructor(){}
  ngOnInit(): void {
    
  }

}
