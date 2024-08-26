import { Injectable } from '@angular/core';
import { IQuestion } from './shared/interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  completeQuestion:IQuestion|null = null;
  validateSelect:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  setcompleteQuestion(question:IQuestion){
    this.completeQuestion = question;
    console.log('Complete Question set');
  }

  getCompleteQuestion():IQuestion|null{
    return this.completeQuestion ? this.completeQuestion : null;
  }

  setValidateSelect(value:boolean){
    this.validateSelect.next(value);
  }

  getValidateSelect(): Observable<boolean> {
    return this.validateSelect;
  }



}
