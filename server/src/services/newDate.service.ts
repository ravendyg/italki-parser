import { Injectable } from '@nestjs/common';
import { EPeriod } from 'types/common-enums';


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

  removeTime(date: Date) {
    let [m, d, y] = date.toLocaleDateString().split('/');
    if (d.length === 1) {
      d = '0' + d;
    }
    if (m.length === 1) {
      m = '0' + m;
    }
    return `${y}-${m}-${d}`;
  }

  getSearchPeriod(period: EPeriod): [Date, Date] {
    const toWeek = this.getWeekNumber();

    let fromWeek: number = toWeek - 1;
    switch (period) {
      case EPeriod.MONTH: {
        fromWeek = toWeek - 4;
        break;
      }
      case EPeriod.MONTHS: {
        fromWeek = toWeek - 13;
        break;
      }
    }
    return [this.weekToDate(fromWeek), this.weekToDate(toWeek)];
  }
}
