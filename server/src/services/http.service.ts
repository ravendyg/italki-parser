import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  TLangJob,
  TScheduleJob,
} from 'types/types';
import { Logger } from './logger.service';
import { IItalkiCourseDto, IItalkiScheduleDto } from 'types/dto';


@Injectable()
export class Http {
  constructor(
    private logger: Logger
  ) {}

  async getLanguage(job: TLangJob): Promise<[IItalkiCourseDto[], boolean]> {
    const {
      lang,
      co,
      page,
    } = job;
    let hasNext = false;
    try {
      const params: any = {
        page_size: 20,
        page,
        teach_language: {
          language: lang,
        },
      };
      if (co) {
        params.teacher_info = {
          origin_country_id: [co],
        };
      }

      const {
        status,
        data: {
          data,
          paging,
        },
      } = await axios.post(
        'https://www.italki.com/api/v2/teachers',
        params,
      );
      if (status !== 200) {
        this.logger.error(`getLanguage: ${lang} ${page} status ${status}`, data);
        return [[], false];
      }

      hasNext = !!paging.has_next;
      return [data, hasNext];
    } catch (e) {
      this.logger.error(`getLanguage: ${lang} ${page}`, e);
      return [[], false];
    }
  }

  async getSchedule(job: TScheduleJob): Promise<IItalkiScheduleDto | null> {
    const {
      from,
      id,
      to,
    } = job;
    const url = `https://www.italki.com/api/v2/teacher/${id}/schedule?`
    + `start_time=${from.toISOString()}&end_time=${to.toISOString()}`
    console.log(url);
    try {
      const {
        status,
        data: { data },
      } = await axios.get(url)
      if (status !== 200) {
        this.logger.error(`getSchedule: ${id} ${from} ${to} status ${status}`, data);
        return null;
      }

      return data;
    } catch (e) {
      this.logger.error(`getSchedule: ${id} ${from} ${to}`, e);
    }
  }
}
