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
  totalCorrectAnswers: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([0]);
  isVisible:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  concateWord:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }


  /**
   * This will set the concate words
   * @param {boolean} value - stating the word type, now it is unknownfor the word used fo =r security purpose
   */
  setConcateWords(value:boolean){
    this.concateWord.next(value);
  }

  /**
   * This will get the concate words
   * @returns {boolean} - the observable boolean
   */
  getConcateWords():Observable<boolean>{
    return this.concateWord;
  }

  /**
   * This will set the visibility in selector and correct section
   * @param {boolean} value - it is the value of visible
   */
  setVisibility(value:boolean){
    this.isVisible.next(value);
  }

  /**
   * This will get the visibility in selector and correct section
   * @returns {Observable<boolean>}  the value of visibility
   */
  getVisibility():Observable<boolean>{
    return this.isVisible;
  }

  /**
   * Sets the complete question by emitting the provided question object.
   * This updates the observable that tracks the current complete question.
   *
   * @param {IQuestion} question - The question object to be set. 
   *                                It should contain all necessary details such as the question text, options, etc.
   */
  setCompleteQuestion(question: IQuestion) {
    this.completeQuestion.next(question);
    console.log('Complete Question set');
  }

  getCompleteQuestion(): Observable<IQuestion | null>  {
      return this.completeQuestion.asObservable();
  }

    /**
   * Sets the validation state for the select input.
   *
   * @param {boolean} value - A boolean value indicating whether the select input is valid or not.
   */
  setValidateSelect(value: boolean) {
    this.validateSelect.next(value);
  }

  /**
   * Returns an observable that emits the current validation state of the select input.
   *
   * @returns {Observable<boolean>} - An observable of the select input's validation state.
   */
  getValidateSelect(): Observable<boolean> {
    return this.validateSelect.asObservable();
  }

  /**
   * Sets the preview state for the highlight section.
   *
   * @param {boolean} value - A boolean value indicating whether the preview is active or not.
   */
  setIsPreview(value: boolean) {
    this.isPreview.next(value);
  }

  /**
   * Returns an observable that emits the current preview state of the highlight section.
   *
   * @returns {Observable<boolean>} - An observable of the preview state.
   */
  getIsPreview(): Observable<boolean> {
    return this.isPreview.asObservable();
  }

  /**
   * Sets the available options for selection.
   *
   * @param {IOptions[]} value - An array of IOptions objects representing the options.
   */
  setOptions(value: IOptions[]) {
    this.options.next(value);
    this.editOptions();
  }

  /**
   * Returns an observable that emits the current list of options available for selection.
   *
   * @returns {Observable<IOptions[]>} - An observable of the options array.
   */
  getOptions(): Observable<IOptions[]> {
    return this.options.asObservable();
  }

  /**
   * Sets the total number of correct answers.
   *
   * @param {number[]} value - An array of numbers representing the indices of correct answers.
   */
  setTotalCorrectAnswer(value: number[]) {
    this.totalCorrectAnswers.next(value);
  }

  /**
   * Returns an observable that emits the current list of correct answers' indices.
   *
   * @returns {Observable<number[]>} - An observable of the correct answers' indices.
   */
  getTotalCorrectAnswer(): Observable<number[]> {
    return this.totalCorrectAnswers.asObservable();
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
