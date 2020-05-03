import React, {
  Fragment,
  useState,
} from 'react';
import Form from '../components/form';
import Graph from '../components/graph';
import { ISearchResultDto, ISearchDto } from '../types/dto';
import { http } from '../services/http';


const emptySearchResult: ISearchResultDto = {
  teachers: [],
  total: 0,
};

function Home() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState(emptySearchResult);

  const setQuery = async (query: ISearchDto) => {
    if (isLoading || !query) return;
    setLoading(true);
    const _res = await http.getLoad(query);
    if (_res) {
      setData(_res);
    }
    setLoading(false);
  };

  return <Fragment>
    <Form
      setQuery={setQuery}
    />
    <Graph
      data={data}
    />
  </Fragment>;
}

export default Home;
