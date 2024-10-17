import React from 'react';
import Btn from './Btn';

const TimerBtn = ({ timer, timerActive, onStart }) => {
  // Function to format time in MM:SS format
  const formatTime = (time) => {
    const minutes = String(Math.floor(time / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="timer-ctnr">
    <Btn
      onClick={onStart}
      label='Timer'
      className="timer-btn"
    />
    <div className='timer-text-display-ctnr'>
        <h2 className='timer-text-display'>{formatTime(timer)}</h2>
    </div>
    </div>
  );
};

export default TimerBtn;
