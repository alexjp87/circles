import React from 'react';
import Btn from './Btn';

const ResetBtn = ({ onReset }) => {
  return (
    <div className='reset-btn-ctnr'>
    <Btn
      onClick={onReset}
      label="Reset"
      className="reset-btn"
    />
    </div>
  );
};

export default ResetBtn;
