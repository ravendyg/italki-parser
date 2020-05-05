import React, {
} from 'react';
import { Line } from 'react-chartjs-2';
import { IDatasetItem } from '../utils/createDataset';


interface IGraphProps {
  count: number;
  total: number;
  labels: string[];
  datasets: IDatasetItem[];
}
export default function Graph(props: IGraphProps) {
  const {
    count,
    datasets,
    labels,
    total,
  } = props;

  return <section className="section">
    <div className='container'>

      {`Displayed ${count} out of ${total}`}

      <Line
        data={{
          labels,
          datasets,
        }}
      />
    </div>
  </section>;
}
