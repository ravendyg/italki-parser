import React from 'react';
import { parseQuery } from '../utils/parse-query';

function SearchResults() {
  const query = parseQuery(new Set(['language', 'teacher']));
  console.log(query);

  return <div>
    SearchResults page
  </div>;
}

export default SearchResults;
