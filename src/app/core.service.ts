import { Injectable } from '@angular/core';
import { IQuestion } from './shared/interface';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  completeQuestion:IQuestion|null = null;
  constructor() { }

  setcompleteQuestion(question:IQuestion){
    this.completeQuestion = question;
    console.log('Complete Question set');
  }

  getCompleteQuestion():IQuestion|null{
    return this.completeQuestion ? this.completeQuestion : null;
  }

}
