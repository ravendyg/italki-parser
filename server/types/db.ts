import {
  ELanguage,
  ECountry,
} from "./common-enums";

export interface ITeacherDb {
  id: number;
  name: string;
  language: ELanguage;
  country: ECountry;
}

export interface IRateDb {
  id: number;
  teacher: number;
}

export interface ILessonsDb {
  id: number;
  date: Date;
  total: number;
  with_stident: number;
}
