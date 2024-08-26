import { Injectable } from '@angular/core';
import { IQuestion } from './shared/interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  completeQuestion:IQuestion|null = null;
  // Validator Select
  validateSelect:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // Highight save and preview section
  isPreview:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  setcompleteQuestion(question:IQuestion){
    this.completeQuestion = question;
    console.log('Complete Question set');
  }

  getCompleteQuestion():IQuestion|null{
    return this.completeQuestion ? this.completeQuestion : null;
  }

  // Select Validator
  setValidateSelect(value:boolean){
    this.validateSelect.next(value);
  }

  getValidateSelect(): Observable<boolean> {
    return this.validateSelect;
  }

  // Highlight save and preview section
  setisPreview(value:boolean){
    this.isPreview.next(value);
  }

  getisPreview():Observable<boolean>{
    return this.isPreview;
  }



}
