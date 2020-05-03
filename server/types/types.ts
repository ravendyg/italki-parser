import {
  ClientConfig,
} from 'pg';
import {
  ELanguage,
  ECountry,
} from './common-enums';


export interface IConfig {
  PG_CONFIG: ClientConfig;
  PORT: number;
  PARSER_INTERVAL: number;
}


export type TLangJob = {
  type: 'lang';
  lang: ELanguage;
  co?: ECountry;
  page: number;
}
export type TTEacherJob = {
  type: 'teacher';
  id: number;
}
export type TScheduleJob = {
  type: 'schedule';
  id: number;
  week: number;
  from: Date;
  to: Date;
}
export type TJob = TLangJob
  | TTEacherJob
  | TScheduleJob
  ;
