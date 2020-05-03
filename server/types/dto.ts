import {
  ELanguage,
  ECountry,
  EPeriod,
} from "./common-enums";

export interface ISearchDto {
  lang: ELanguage;
  co?: ECountry;
  period: EPeriod;
}

export interface ILoadDto {
  d: string;
  t: number;
  w: number;
}

export interface ITeacherDto {
  id: number;
  name: string;
  load: ILoadDto[];
}

export interface ISearchResultDto {
  total: number;
  teachers: ITeacherDto[];
}

export interface IItalkiCourseDto {
  course_info: {
    min_price: number;
  };
  also_speak: {
    teach_language: {
      language: ELanguage;
      level: number;
    }[];
  };
  teacher_info: {
    teach_language: {
      language: ELanguage;
      level: number;
    }[];
  };
  user_info: {
    is_pro: number;
    nickname: string;
    origin_country_id: ECountry;
    user_id: number;
  }
}

export interface IItalkiLessonDto {
  start_time: string;
  end_time: string;
}

export interface IItalkiScheduleDto {
  available_schedule: IItalkiLessonDto[];
  teacher_lesson: IItalkiLessonDto[];
}
