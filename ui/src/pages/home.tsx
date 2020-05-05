import React, {
  Fragment,
  useState,
} from 'react';
import Form from '../components/form';
import Graph from '../components/graph';
import { ISearchResultDto, ISearchDto } from '../types/dto';
import { http } from '../services/http';
import { createDataset, EDisplayMode } from '../utils/createDataset';


function Home() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(null as ISearchResultDto | null);
  const [displayMode, setDisplayMode] = useState(EDisplayMode.VALUES);

  const setQuery = async (query: ISearchDto) => {
    if (isLoading || !query) return;
    setLoading(true);
    const _res = await http.getLessons(query);
    if (_res) {
      setData(_res);
    }
    setLoading(false);
  };

  let graph = null;
  if (data) {
    const [labels, datasets] = createDataset(data, displayMode);
    const count = data.teachers.length;
    const total = data.total;

    graph = <Graph
      count={count}
      datasets={datasets}
      labels={labels}
      total={total}
    />;
  }

  return <Fragment>
    <Form
      setQuery={setQuery}
      displayMode={displayMode}
      setDisplayMode={setDisplayMode}
    />
    {graph}
  </Fragment>;
}

export default Home;
