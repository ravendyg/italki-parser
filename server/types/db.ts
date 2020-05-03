import {
  ELanguage,
  ECountry,
} from "./common-enums";

export interface ITeacherDb {
  id: number;
  country: ECountry;
  name: string;
  flags: number;  // [pro]
}

export interface ILanguageDb {
  id: number;
  teacher: number;
  language: ELanguage;
  level: number;
}

export interface IRateDb {
  id: number;
  teacher: number;
  rate: number;
  changed: Date;
}

export interface ILessonsDb {
  id: number;
  date: Date;
  total: number;
  with_student: number;
}
