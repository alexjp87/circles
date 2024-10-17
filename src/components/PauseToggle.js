import React from 'react';
import Btn from './Btn';

const PauseToggle = ({ isPaused, onClick }) => {
  return (
    <div className='pause-toggle-ctnr'>
    <Btn
      onClick={onClick}
      label={isPaused ? 'Resume' : 'Pause'}
      className="pause-toggle"
    />
    </div>
  );
};

export default PauseToggle;
