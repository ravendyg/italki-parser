import { constants } from '../constants';
import { ISearchResultDto } from '../types/dto';
import { EPeriod } from '../types/common-enums';


const backgroundColors = [
  'rgba(213, 120, 91, 0.2)',
  'rgba(195, 131, 68, 0.2)',
  'rgba(167, 144, 59, 0.2)',
  'rgba(134, 154, 70, 0.2)',
  'rgba(98, 160, 96, 0.2)',
  'rgba(64, 162, 128, 0.2)',
  'rgba(50, 161, 159, 0.2)',
  'rgba(81, 156, 180, 0.2)',
  'rgba(129, 146, 188, 0.2)',
  'rgba(172, 133, 179, 0.2)',
  'rgba(204, 122, 156, 0.2)',
  'rgba(219, 116, 125, 0.2)',
];

export enum EDisplayMode {
  VALUES = 'values',
  INCREMENT = 'increment',
}

export interface IDatasetItem {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
}

function nextTsp(tsp: number, period: EPeriod) {
  switch (period) {
    case EPeriod.MONTH:
    case EPeriod.MONTHS: {
      return tsp + 7 * constants.DAY;
    }
    case EPeriod.YEAR: {
      const _d = new Date(tsp);
      const _d2 = new Date(_d.setMonth(_d.getMonth() + 1));
      return _d2.getTime();
    }
    default: {
      return tsp + constants.DAY;
    }
  }
}

let _labels: string[] = [];
let _datasets: IDatasetItem[] = [];
let _previousData: ISearchResultDto | null = null;

export function createDataset(
  data: ISearchResultDto,
  displayMode: EDisplayMode,
): [string[], IDatasetItem[]] {

  if (data === _previousData) {
    return [_labels, _datasets];
  }

  _labels = [];
  _datasets = [];
  // const arr = data.teachers.slice(0, 3);
  const arr = data.teachers;
  const {
    from,
    to,
    period,
  } = data;
  let step = constants.DAY;

  let dateNum = new Date(from).getTime();
  if (displayMode === EDisplayMode.INCREMENT) {
    dateNum = nextTsp(dateNum, period);
  }
  while (dateNum < new Date(to).getTime()) {
    const date = new Date(dateNum)
    const dateStr = date.toISOString().slice(0, 10)
    const dayOfWeek = constants.DAY_OF_WEEK[date.getDay()];
    _labels.push(`${dateStr} (${dayOfWeek})`);

    dateNum = nextTsp(dateNum, period);
  }

  const nameCounter: { [key: string]: number } = {};
  arr.forEach((item, index) => {
    let label;
    if (nameCounter[item.name]) {
      nameCounter[item.name]++;
      label = `${item.name}: ${nameCounter[item.name]}`;
    } else {
      nameCounter[item.name] = 1;
      label = item.name;
    }
    const _d: IDatasetItem = {
      label,
      data: [],
      backgroundColor: backgroundColors[index % backgroundColors.length],
      borderColor: 'rgba(0, 0, 0, 0)',
    };

    let prevDate = new Date(from).getTime();
    let date = prevDate;
    if (displayMode === EDisplayMode.INCREMENT) {
      date = nextTsp(date, period);
    }
    while (date < new Date(to).getTime()) {
      switch (displayMode) {
        case EDisplayMode.INCREMENT: {
          const prevKey = new Date(prevDate).toISOString().slice(0, 10);
          const key = new Date(date).toISOString().slice(0, 10);
          const point = (item.lessons[key] || 0) - (item.lessons[prevKey] || 0);
          _d.data.push(point / 100);
          break;
        }

        default: {
          const key = new Date(date).toISOString().slice(0, 10);
          const point = item.lessons[key] || 0;
          _d.data.push(point / 100);
        }
      }

      date = nextTsp(date, period);
      prevDate = nextTsp(prevDate, period);
    }

    _datasets.push(_d);
  });

  return [_labels, _datasets];
}
