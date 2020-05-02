import React from 'react';
import { useParams } from 'react-router-dom';

function Teacher() {
  const { id } = useParams();
  console.log(`teacher: ${id}`);

  return <div>
    Teacher page
  </div>;
}

export default Teacher;
