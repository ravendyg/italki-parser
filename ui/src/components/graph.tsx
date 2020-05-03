import React, {
  useState,
  ChangeEvent,
} from 'react';
import { Line } from 'react-chartjs-2';
import { ISearchResultDto } from "../types/dto";
import { constants } from '../constants';
import { EPeriod } from '../types/common-enums';


enum EDataProjection {
  TOTAL = 'total',
  WORK = 'work',
  RATIO = 'ratio',
}

interface IDatasetItem {
  label: string;
  data: number[];
}

export default function Graph({ data }: { data: ISearchResultDto | null }) {
  const [isLoading, setLoading] = useState(false);
  const [source, setSource] = useState(EDataProjection.WORK);
  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSource(e.target.value as EDataProjection)
  };

  const labels: string[] = [];
  const datasets: IDatasetItem[] = [];
  if (data !== null) {
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
      let date = new Date(from).getTime();
      date <= new Date(to).getTime();
      date += step
    ) {
      labels.push(new Date(date).toISOString().slice(0, 10));
    }

    arr.forEach(item => {
      const _d: IDatasetItem = {
        label: item.name,
        data: [],
      };
      for (
        let date = new Date(from).getTime();
        date <= new Date(to).getTime();
        date += step
      ) {
        const key = new Date(date).toISOString().slice(0, 10);
        const point = item.lessons[key];
        if (point) {
          switch (source) {
            case EDataProjection.TOTAL: {
              _d.data.push(point.t / 100);
              break;
            }
            case EDataProjection.WORK: {
              _d.data.push(point.w / 100);
              break;
            }
            case EDataProjection.RATIO: {
              if (point.t > 0) {
                _d.data.push(point.w / point.t);
              } else {
                _d.data.push(0);
              }
              break;
            }
          }
        } else {
          _d.data.push(0);
        }
      }
      datasets.push(_d);
    });

    console.log(datasets)
  }

  return <section className="section">
    <div className='container'>
      <div className="control">
        <label className="radio">
          <input
            type="radio"
            value={EDataProjection.TOTAL}
            checked={source === EDataProjection.TOTAL}
            onChange={handleRadioChange}
          />
          Total
        </label>
        <label className="radio">
          <input
            type="radio"
            value={EDataProjection.WORK}
            checked={source === EDataProjection.WORK}
            onChange={handleRadioChange}
          />
          Work
        </label>
        <label className="radio">
          <input
            type="radio"
            value={EDataProjection.RATIO}
            checked={source === EDataProjection.RATIO}
            onChange={handleRadioChange}
          />
          Ratio
        </label>
      </div>

      {data && `Displayed ${data.teachers.length} out of ${data.total}`}

      {data && <Line
        data={{
          labels,
          datasets,
        }}
      />}
    </div>
  </section>;
}
