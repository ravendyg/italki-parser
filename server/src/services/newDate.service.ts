import { Injectable } from '@nestjs/common';


// reference is 2020
const zeroWeek = new Date('2019-12-30');
const weekSize = 1000 * 60 * 60 * 24 * 7;

@Injectable()
export class NewDate {
  getWeekNumber(d: Date = new Date()) {
    // @ts-ignore
    return Math.floor((d - zeroWeek) / weekSize);
  }

  weekToDate(week: number) {
    return new Date(zeroWeek.getTime() + week * weekSize);
  }

  getWeekStart(d: Date) {
    return this.weekToDate(this.getWeekNumber(d));
  }
}
