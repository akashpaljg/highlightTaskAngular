export interface IOptions {
    word: string;
    isSelected: boolean;
    isCorrect: boolean;
}

export interface IQuestion {
  question:string;
  textPhrase:string;
  options:IOptions[];
  answersCount:number;
}