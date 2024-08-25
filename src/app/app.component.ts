import { Component, OnInit } from '@angular/core';
import { INavLinks } from './shared/interface';
@Component({
  selector: 'app-root',
  templateUrl:'./app.component.html',
  styleUrls:['./app.component.css']
})
export class AppComponent implements OnInit {
  navLinks:INavLinks[] = [{title:'Content',url:'Content',isActive:true},{title:'Users',url:'Users',isActive:false},{title:'Admin',url:'Admin',isActive:false},{imageUrl:"assets/icons/alerts.svg",url:'Alerts',isActive:false},{imageUrl:"assets/icons/announcements.svg",url:'Announcements',isActive:false},{imageUrl:"assets/icons/account_circle.svg",url:'Account',isActive:false}];
  constructor(){}
  ngOnInit(): void {
    
  }

  handleActive(i:number){

    this.navLinks.map((nav)=>{
      nav.isActive = false;
    })
    this.navLinks[i].isActive = true;
  }

}
