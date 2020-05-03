import React, {
  useState,
} from 'react';
import { ISearchResultDto } from "../types/dto";

export default function Graph({ data }: { data: ISearchResultDto }) {
  const [isLoading, setLoading] = useState(false);

  return <section className="section">
    <div className='container'>
      {`Displayed ${data.teachers.length} out of ${data.total}`}
    </div>
  </section>;
}
