import React from 'react';
import Btn from './Btn';

const SquareToggle = ({ isSquare, toggleSquare }) => {
  return (
    <div className='square-toggle-ctnr'>
    <Btn
      onClick={toggleSquare}
      label={isSquare ? '◯' : '■'}
      className="square-toggle"
    />
    </div>
  );
};

export default SquareToggle;
