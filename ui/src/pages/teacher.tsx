import React from 'react';
import { useParams } from 'react-router-dom';

function Teacher() {
  const { id } = useParams();

  return <div>
    Teacher page
  </div>;
}

export default Teacher;
