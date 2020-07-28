import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  TLangJob,
  TScheduleJob,
} from 'types/types';
import { Logger } from './logger.service';
import { IItalkiCourseDto, IItalkiScheduleDto } from 'types/dto';
import { asyncWait } from 'src/utils/asyncWait';
import { constants } from 'src/constants';


@Injectable()
export class Http {
  constructor (
    private logger: Logger
  ) { }

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

    for (let attempt = 1; attempt < 5; attempt++) {
      try {
        const {
          status,
          data: { data },
        } = await axios.get <{data: IItalkiScheduleDto}>(url)
        if (status !== 200) {
          this.logger.error(`getSchedule: ${id} ${from} ${to} status ${status} att: ${attempt}`, data);
        } else {
          this.logger.info(`fetched schedule ${url}. T les: ${data.teacher_lesson.length}, A les: ${data.available_schedule.length}`);
          return data;
        }
      } catch (e) {
        this.logger.error(`getSchedule: ${id} ${from} ${to} att: ${attempt}`, e);
      }
      await asyncWait(10 * constants.SECOND);
    }
  }
}
