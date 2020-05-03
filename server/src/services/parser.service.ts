import { Injectable } from '@nestjs/common';
import {
  ELanguage,
  ECountry,
} from 'types/common-enums';
import { NewDate } from './newDate.service';
import { constants } from 'src/constants';
import { config } from 'src/config';
import { Http } from './http.service';
import { TJob, TScheduleJob } from 'types/types';
import { Crypto } from './crypto.service';
import { DbService } from './db.service';
import { Logger } from './logger.service';


const checkWeekly: TJob[] = [
  {
    type: 'lang',
    lang: ELanguage.ITALIAN,
    co: ECountry.RUSSIA,
    page: 1
  }
];

@Injectable()
export class Parser {
  private queue: TJob[] = [];
  private lastWeek: number;

  constructor(
    private newDate: NewDate,
    private http: Http,
    private dbService: DbService,
    private crypto: Crypto,
    private logger: Logger,
  ) {
    this.setUpQueue();

    setInterval(() => {
      this.setUpQueue();
    }, 2 * constants.HOUR);

    setInterval(() => {
      this.processQueue();
    }, config.PARSER_INTERVAL);
  }

  private setUpQueue() {
    const thisWeek = this.newDate.getWeekNumber();
    if (thisWeek !== this.lastWeek) {
      for (const job of checkWeekly) {
        this.queue.push(job)
      }
      this.lastWeek = thisWeek;
    }
  }

  private async processQueue() {
    const job = this.queue.shift();

    if (!job) {
      return;
    }

    const jobHash = this.crypto.getSha256(job);
    if (jobHash === null) {
      this.logger.error('invalid job', job);
      return;
    }

    const weekRan = await this.dbService.getJobWeek(jobHash);
    const thisWeek = this.newDate.getWeekNumber();
    if (weekRan === thisWeek) {
      return;
    }

    switch (job.type) {
      case 'lang': {
        const [data, hasNext] = await this.http.getLanguage(job);
        await this.dbService.setJobWeek(jobHash, thisWeek);
        if (hasNext) {
          const newJob = {
            ...job,
            page: job.page + 1,
          };
          this.queue.push(newJob);
        }

        for (const courseDto of data) {
          const week = await this.dbService.updateTeacher(courseDto);
          if (week !== null && week < thisWeek) {
            const newJob: TScheduleJob = {
              id: courseDto.user_info.user_id,
              type: 'schedule',
              week,
              from: this.newDate.weekToDate(week),
              to: this.newDate.weekToDate(week + 1),
            };
            this.queue.push(newJob);
          }
        }
        break;
      }

      case 'schedule': {
        const schedule = await this.http.getSchedule(job);
        console.log(schedule);
        if (schedule) {
          const acc = new Map<string, number>();
          for (const item of schedule.teacher_lesson) {
            const key = item.start_time.slice(0, 10);
            // @ts-ignore
            const diff = Math.round((new Date(item.end_time) - new Date(item.start_time)) / constants.HOUR * 100);
            acc.set(key, (acc.get(key) || 0) + diff);
          }

          const nextWeek = job.week + 1;
          await this.dbService.createLessons(job.id, acc, nextWeek);

          if (nextWeek < thisWeek) {
            this.queue.push({
              ...job,
              week: nextWeek,
              from: this.newDate.weekToDate(nextWeek),
              to: this.newDate.weekToDate(nextWeek + 1),
            });
          }
        }
        break;
      }
    }
  }
}
