import { constants } from '../constants';
import { ISearchResultDto } from '../types/dto';


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

export interface IDatasetItem {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
}

let _labels: string[] = [];
let _datasets: IDatasetItem[] = [];
let _previousData: ISearchResultDto | null = null;

export function createDataset(data: ISearchResultDto | null): [string[], IDatasetItem[]] {
  if (data === _previousData) {
    return [_labels, _datasets];
  }

  if (data !== null) {
    _labels = [];
    _datasets = [];
    // const arr = data.teachers.slice(0, 3);
    const arr = data.teachers;
    const {
      from,
      to,
      // period,
    } = data;
    let step: number = constants.DAY;
    // TODO: implement aggregation on the server
    // switch (period) {
    //   case EPeriod.MONTHS: {
    //     step = step * 7; // weeks
    //     break;
    //   }
    // }
    for (
      let dateNum = new Date(from).getTime();
      dateNum <= new Date(to).getTime();
      dateNum += step
    ) {
      const date = new Date(dateNum)
      const dateStr = date.toISOString().slice(0, 10)
      const dayOfWeek = constants.DAY_OF_WEEK[date.getDay()];
      _labels.push(`${dateStr} (${dayOfWeek})`);
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
      for (
        let date = new Date(from).getTime();
        date <= new Date(to).getTime();
        date += step
      ) {
        const key = new Date(date).toISOString().slice(0, 10);
        const point = item.lessons[key] || 0;
        _d.data.push(point / 100);
      }
      _datasets.push(_d);
    });
  }

  return [_labels, _datasets];
}