import React from 'react';

const GridTimer = ({ timer }) => {
    return (
        <div className='grid-timer-ctnr'>
            <h2 className='grid-timer'>{timer.toFixed(1)}</h2>
        </div>
    );
};

export default GridTimer;