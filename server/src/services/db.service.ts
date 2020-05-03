import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import {
  ELanguage,
  ECountry,
  EPeriod,
} from 'types/common-enums';
import { config } from '../config';
import {
  ISearchResultDto,
  ITeacherDto,
  ILessonsDto,
  IItalkiCourseDto,
} from 'types/dto';
import { Logger } from './logger.service';
import { NewDate } from './newDate.service';


const pgPool = new Pool(config.PG_CONFIG);

const rowLimit = 20;
const makeGetTeachersQuery = (filterByCountry: boolean) => {
  return `
    SELECT
      teachers.id AS id,
      teachers.name AS name,
      teachers.country AS country
    FROM teachers
    INNER JOIN languages
      ON teachers.id = languages.teacher
    WHERE
      languages.language = $1
      ${filterByCountry ? 'AND teachers.country = $2' : ''}
    LIMIT ${rowLimit}
  ;`
};

const makeCountTeachers = (filterByCountry: boolean) => {
  return `
    SELECT count(*) AS count
    FROM teachers
    INNER JOIN languages
      ON teachers.id = languages.teacher
    WHERE
      languages.language = $1
      ${filterByCountry ? 'AND teachers.country = $2' : ''}
  ;`
};

const UPDATE_TEACHER_WEEK = `
  UPDATE teachers
  SET schedule = $1
  WHERE id = $2
;`;

const makeGetLessonsQuery = (ids: number[]) => {
  return `
    SELECT
      teacher,
      date,
      total
    FROM lessons
    WHERE
      teacher IN (${ids.join(',')})
      AND date >= $1::DATE
      AND date < $2::DATE
  ;`
};

const GET_JOB_WEEK_QUERY = `
  SELECT week
  FROM jobs
  WHERE hash = $1
;`;

const UPSERT_JOB_WEEK_QUERY = `
  INSERT INTO jobs (hash, week)
  VALUES ($1, $2)
  ON CONFLICT (hash)
  DO UPDATE SET week = $2
;`;

const GET_TEACHER_QUERY = `
  SELECT *
  FROM teachers
  WHERE id = $1
  LIMIT 1
;`;

const CREATE_TEACHER_QUERY = `
  INSERT INTO teachers
    (id, name, country)
  VALUES ($1, $2, $3)
;`;

const CREATE_LANGUAGE_QUERY = `
  INSERT INTO languages
   (teacher, language, level)
  VALUES ($1, $2, $3)
  ON CONFLICT (teacher, language) DO NOTHING
;`;

const CREATE_LESSONS_QUERY = `
  INSERT INTO lessons
    (teacher, date, total)
  VALUES ($1, $2, $3)
  ON CONFLICT (teacher, date) DO NOTHING
;`;

export interface IGetTeacherLessons {
  lang: ELanguage;
  period: EPeriod;
  co?: ECountry;
}

@Injectable()
export class DbService {
  constructor(
    private newDate: NewDate,
    private logger: Logger,
  ) {}

  async getTeacherLessons(args: IGetTeacherLessons): Promise<ISearchResultDto> {
    const {
      lang,
      period,
      co,
    } = args;
    const countQuery = makeCountTeachers(!!co);
    const getQuery = makeGetTeachersQuery(!!co);

    const [from, to] = this.newDate.getSearchPeriod(period);
    const result: ISearchResultDto = {
      teachers: [],
      total: 0,
      from: this.newDate.removeTime(from),
      to: this.newDate.removeTime(to),
      period,
    };

    const client = await pgPool.connect();
    try {
      const args: any[] = [lang];
      if (co) {
        args.push(co);
      }
      // count teachers
      const resCount = await client.query(countQuery, args);
      if (resCount.rows.length === 0) {
        return result;
      }
      result.total = resCount.rows[0].count;

      // get teachers
      const resGet = await client.query(getQuery, args);

      // get lessons
      const teachers = resGet.rows.map(({ id }) => id);
      if (teachers.length === 0) {
        return result;
      }

      const teachersMap = new Map<number, ILessonsDto>();
      for (const teacherId of teachers) {
        teachersMap.set(teacherId, {});
      }
      const getLessongArgs = [from, to];
      const getLessonsQuery = makeGetLessonsQuery(teachers);
      const lesRes = await client.query(getLessonsQuery, getLessongArgs);

      // format
      for (const row of lesRes.rows) {
        const lessons = teachersMap.get(row.teacher);
        lessons[this.newDate.removeTime(row.date)] = row.total;
      }
      for (const teacher of resGet.rows) {
        const teacherDto: ITeacherDto = {
          id: teacher.id,
          lessons: teachersMap.get(teacher.id),
          name: teacher.name,
        };
        result.teachers.push(teacherDto);
      }
    } catch (e) {
      this.logger.error(`getTeachers: ${lang}, ${co}`, e);
    } finally {
      client.release();
    }

    return result;
  }

  async getJobWeek(hash: string) {
    const client = await pgPool.connect();
    try {
      const res = await client.query(GET_JOB_WEEK_QUERY, [hash]);
      if (res.rows.length === 0) {
        return null;
      }
      return res.rows[0].week as number;
    } catch (e) {
      this.logger.error('getJobWeek', e);
      return null;
    } finally {
      client.release();
    }
  }

  async setJobWeek(hash: string, week: number) {
    const client = await pgPool.connect();
    try {
      await client.query(UPSERT_JOB_WEEK_QUERY, [hash, week]);
    } catch (e) {
      this.logger.error('setJobWeek', e);
    } finally {
      client.release();
    }
    return null;
  }

  async updateTeacher(teacher: IItalkiCourseDto) {
    const client = await pgPool.connect();
    try {
      await client.query('BEGIN');

      const res1 = await client.query(GET_TEACHER_QUERY, [teacher.user_info.user_id]);
      const dbTeacher = res1.rows.length > 0 ? res1.rows[0] : null;

      let schedule = 10;
      if (dbTeacher) {
        // TODO: check whether the new languages have been added.
        schedule = dbTeacher.schedule;
      } else {
        await client.query(CREATE_TEACHER_QUERY, [
          teacher.user_info.user_id,
          teacher.user_info.nickname,
          teacher.user_info.origin_country_id,
        ]);
        for (const lang of teacher.teacher_info.teach_language) {
          await client.query(CREATE_LANGUAGE_QUERY, [
            teacher.user_info.user_id,
            lang.language,
            lang.level,
          ]);
        }
      }

      await client.query('COMMIT');
      return schedule;
    } catch (e) {
      this.logger.error('updateTeacher', teacher, e);
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }

    return null;
  }

  async createLessons(
    teacherId: number,
    acc: Map<string, number>,
    week: number,
  ) {
    const client = await pgPool.connect();
    try {
      for (const [key, hours] of acc.entries()) {
        const args = [teacherId, new Date(key), hours];
        await client.query(CREATE_LESSONS_QUERY, args);
        await client.query(UPDATE_TEACHER_WEEK, [week, teacherId]);
      }
    } catch (e) {
      this.logger.error('createLessons', teacherId, acc, e);
    } finally {
      client.release();
    }
  }
}
