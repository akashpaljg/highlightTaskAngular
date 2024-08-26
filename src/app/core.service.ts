import { Injectable } from '@angular/core';
import { IOptions, IQuestion } from './shared/interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  completeQuestion: BehaviorSubject<IQuestion | null> = new BehaviorSubject<IQuestion | null>(null);
  validateSelect: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isPreview: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  options: BehaviorSubject<IOptions[]> = new BehaviorSubject<IOptions[]>([]);
  totalCorrectAnswers: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  isVisible:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  concateWord:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  // Setting concate words
  setConcateWords(value:boolean){
    this.concateWord.next(value);
  }

  getConcateWords():Observable<boolean>{
    return this.concateWord;
  }

  // Setting visibility of selector and correct answers
  setVisibility(value:boolean){
    this.isVisible.next(value);
  }

  getVisibility():Observable<boolean>{
    return this.isVisible;
  }

  // Setting complete question
  setCompleteQuestion(question: IQuestion) {
    this.completeQuestion.next(question);
    console.log('Complete Question set');
  }

  getCompleteQuestion(): BehaviorSubject<IQuestion | null> {
    return this.completeQuestion;
  }

  // Select Validator
  setValidateSelect(value: boolean) {
    this.validateSelect.next(value);
  }

  getValidateSelect(): Observable<boolean> {
    return this.validateSelect;
  }

  // Highlight save and preview section
  setIsPreview(value: boolean) {
    this.isPreview.next(value);
  }

  getIsPreview(): Observable<boolean> {
    return this.isPreview;
  }

  // Playing with options
  setOptions(value: IOptions[]) {
    this.options.next(value);
    this.editOptions();
  }

  getOptions(): Observable<IOptions[]> {
    return this.options;
  }

  // Total Correct Answers
  setTotalCorrectAnswer(value: number[]) {
    this.totalCorrectAnswers.next(value);
  }

  getTotalCorrectAnswer(): Observable<number[]> {
    return this.totalCorrectAnswers;
  }

  editOptions() {
    const currentOptions = this.options.getValue();
    const currentQuestion = this.completeQuestion.getValue();
    if (currentQuestion) {
      const updatedQuestion = {
        ...currentQuestion,
        options: currentOptions
      };

      this.getCorrectAnswer(currentOptions);
      const previewAvailable = this.checkPreview(updatedQuestion);

      this.setIsPreview(previewAvailable);
      this.setCompleteQuestion(updatedQuestion);
      console.log("Service got the data");
    }
  }

  getCorrectAnswer(options: IOptions[] | null): void {
    if (!options) {
      return;
    }

    let total = 0;
    options.forEach((o: IOptions) => {
      total = o.isCorrect ? total + 1 : total;
    });
    const answer = Array.from({ length: total }, (_, i) => i + 1)
    this.setTotalCorrectAnswer(answer);
  }

  checkPreview(completeQuestion: IQuestion): boolean {
    if (!completeQuestion.question.trim() || !completeQuestion.textPhrase.trim()) {
      return false;
    }

    const selectedCount = completeQuestion.options.filter(o => o.isSelected).length;
    const correctCount = completeQuestion.options.filter(o => o.isCorrect).length;

    return selectedCount > 0 && correctCount > 0;
  }
}
