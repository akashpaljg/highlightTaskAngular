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
      if (o.isCorrect) {
        total += 1;
      }
    });
  
    // Generate an array starting from 0 up to `total - 1`
    const answer = Array.from({ length: total }, (_, i) => i+1);
  
    // If there are no correct answers, set [0] as the answer
    this.setTotalCorrectAnswer(answer.length > 0 ? answer : [0]);
  }
  

  checkPreview(completeQuestion: IQuestion): boolean {
    if (!completeQuestion.question.trim() || !completeQuestion.textPhrase.trim()) {
      return false;
    }

    const selectedCount = completeQuestion.options.filter(o => o.isSelected).length;
    const correctCount = completeQuestion.options.filter(o => o.isCorrect).length;

    return selectedCount > 0 && correctCount > 0;
  }

  getWordOptions(textPhrase: string): IOptions[] {
    // Return an empty array if textPhrase is empty, null, or undefined
    if (!textPhrase || textPhrase.trim() === "") {
      return [];
    }
  
    // Split the text into paragraphs
    const paragraphs = textPhrase.split(/\n+/);
  
    // Process each paragraph
    const processedParagraphs = paragraphs.map(paragraph => {
      const wordOptions: string[] = paragraph
        .split(/(\s+)/)
        .map(word => word.trim())
        .filter(word => word.length > 0);
  
      return wordOptions.map((word) => ({
        word: word,
        isSelected: false,
        isCorrect: false
      }));
    });
  
    // Flatten the array of paragraphs, inserting a newline object between paragraphs
    return processedParagraphs.reduce((acc, paragraph, index) => {
      if (index > 0) {
        acc.push({ word: '\n', isSelected: false, isCorrect: false });
      }
      return acc.concat(paragraph);
    }, []);
  }

  getSentenceOptions(textPhrase: string): IOptions[] {
    // Split the text by paragraphs first
    const paragraphs: string[] = textPhrase.split(/\n+/);
  
    let sentenceOptions: IOptions[] = [];
  
    paragraphs.forEach(paragraph => {
      // Use a regular expression to split the paragraph into sentences, keeping the full stops
      const sentences = paragraph.match(/[^.!?]+[.!?]*/g) || []; 
  
      sentences.forEach(sentence => {
        sentenceOptions.push({
          word: sentence.trim(),
          isSelected: false,
          isCorrect: false
        });
      });
  
      // Add a paragraph separator if needed (optional)
      sentenceOptions.push({
        word: '\n', // Represents a paragraph break
        isSelected: false,
        isCorrect: false
      });
    });
  
    // Remove the last paragraph separator if it's not needed
    if (sentenceOptions[sentenceOptions.length - 1].word === '\n') {
      sentenceOptions.pop();
    }
  
    return sentenceOptions;
  }

  getParagraphOptions(textPhrase: string): IOptions[] {
    // Split the text into paragraphs using one or more newline characters as the delimiter
    const paragraphOptions: string[] = textPhrase.split(/\n+/);
  
    // Map each paragraph into the required structure
    let result: IOptions[] = [];
  
    paragraphOptions.forEach((paragraph, index) => {
      // Trim the paragraph to remove leading/trailing whitespace
      paragraph = paragraph.trim();
  
      if (paragraph.length > 0) {
        result.push({
          word: paragraph,
          isSelected: false,
          isCorrect: false
        });
  
        // Add a separator for the paragraph, using '\n' to represent the separation
        if (index < paragraphOptions.length - 1) {
          result.push({
            word: '\n', // This represents a paragraph break
            isSelected: false,
            isCorrect: false
          });
        }
      }
    });
  
    return result;
  }

  
}
